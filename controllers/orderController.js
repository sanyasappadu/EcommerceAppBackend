const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Address = require('../models/Address');

exports.createOrder = async (req, res) => {
  try {
    const { products, couponCode, discountAmount = 0 } = req.body;
    const DELIVERY_CHARGE = 10;

    // ── Validate user ──────────────────────────────────────
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // ── Validate products array ────────────────────────────
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    // ── Resolve delivery address ───────────────────────────
    const dbUser = await User.findById(req.user._id).populate('addresses');
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let resolvedAddress = dbUser.defaultAddress;

    // If no default address, use first available address
    if (!resolvedAddress && dbUser.addresses?.length > 0) {
      resolvedAddress = dbUser.addresses[0]._id;
    }

    if (!resolvedAddress) {
      return res.status(400).json({
        message: 'No delivery address found. Please add an address in your profile first.'
      });
    }

    // ── Validate products & decrement stock ────────────────
    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      if (!item.productId) {
        return res.status(400).json({ message: 'Invalid product data' });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`
        });
      }

      product.stock -= item.quantity;
      await product.save();

      totalPrice += product.price * item.quantity;
      orderProducts.push({
        product:  product._id,
        quantity: item.quantity,
        size:     item.size || undefined,
      });
    }

    // ── Calculate final price ──────────────────────────────
    const validDiscount = Math.min(Number(discountAmount) || 0, totalPrice);
    const finalPrice    = parseFloat((totalPrice - validDiscount + DELIVERY_CHARGE).toFixed(2));

    // ── Create order ───────────────────────────────────────
    const order = await Order.create({
      user:            req.user._id,
      products:        orderProducts,
      totalPrice:      parseFloat(totalPrice.toFixed(2)),
      discountAmount:  validDiscount,
      couponCode:      couponCode || null,
      finalPrice,
      deliveryAddress: resolvedAddress,
    });

    // ── Return populated order ─────────────────────────────
    const populated = await Order.findById(order._id)
      .populate('products.product')
      .populate('deliveryAddress');

    res.status(201).json(populated);

  } catch (error) {
    console.error('Create order error:', error); // ✅ log full error
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .populate('deliveryAddress')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.product')
      .populate('user', 'name email')
      .populate('deliveryAddress')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product')
      .populate('deliveryAddress');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};