const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        products: [{
            type: String
        }],
        
    },
);

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;