const User = require('../models/User');

exports.addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.wishlist.push(req.body.productId);
        await user.save();
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const itemIndex = user.cart.findIndex(item => item.product.toString() === req.body.productId);
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += req.body.quantity || 1;
        } else {
            user.cart.push({ product: req.body.productId, quantity: req.body.quantity || 1 });
        }
        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getWishList = async (req, res) => {
  try {
      const user = await User.findById(req.params.id).populate('wishlist');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user.wishlist);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
      const user = await User.findById(req.params.id).populate('cart.product');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user.cart);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};
