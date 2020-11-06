const express = require('express');
const router = new express.Router();
const Product = require('../models/product');
const {ObjectID} = require('mongodb');
const User        = require('../models/user');
const Cart = require('../models/cart');
const authenticate  = require('../middleware/auth');
const path = require('path');


router.post("/mycart/:productName", authenticate, async (req, res) => {

    const productName = req.params.productName;
    const product = await Product.findOne({ productName: productName });
    const productId = product.productName;
    const userId = req.user._id;
    if (!ObjectID.isValid(userId)) {
        return res.status(404).send();
    }


    try {
        let cart = await Cart.findOne({userId : userId});
        if(cart != null)
        {
            Cart.findByIdAndUpdate(cart._id,
                {$push: {products: productName}},
                {safe: true, upsert: true},
                function(err, doc) {
                    if(err){
                        console.log(err);
                    }else{
                        return res.status(200).send(cart)
                    }
                })
        }
        else {
            const newCart = await Cart.create({
                userId : userId,
                products: [productName]
            });
            return res.status(201).send(newCart);
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
})

router.get("/mycart", authenticate, async (req, res) => {
    const userId = req.user._id;
    console.log(userId);
    try {
        const cart = await Cart.findOne({ userId: userId });
        res.status(200).send(cart);
    } catch (e) {
        res.status(500).send()
    }
});

module.exports = router;