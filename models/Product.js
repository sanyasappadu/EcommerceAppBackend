const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Electronics', 'Active Wear', 'Clothes', 'Shoes', 'Footwear'] // ✅ add enum
    },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    sizes: [{
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL']
    }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;