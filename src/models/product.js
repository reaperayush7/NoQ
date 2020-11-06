const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productPicture: {
        type: String,
    },
    productName: {
        type: String,
        trim: true,
        required: true,
    },
    productDescription: {
        type: String,
        trim: true
    },
    productPrice: {
        type: Number,
        min: 0,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
