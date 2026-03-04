const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        size: { type: String, enum: ["S", "M", "L", "XL", "XXL"] },
      },
    ],
    totalPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 }, // ✅ how much was discounted
    couponCode: { type: String, default: null }, // ✅ which coupon was used
    finalPrice: { type: Number, required: true }, // ✅ totalPrice - discount + delivery
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
  },
  { timestamps: true },
);


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;