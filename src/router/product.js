const express = require('express');
const router = new express.Router();
const Product = require('../models/product');
const {ObjectID} = require('mongodb');
const authenticate = require('../middleware/auth');
const path = require('path');
const QRCode = require('qrcode');
const multer  = require('multer');

const diskstorage = multer.diskStorage({
    destination: "./images/productImage",
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        callback(null, file.fieldname + "-" + Date.now() + ext);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("You can upload only image files!"), false);
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: diskstorage,
    fileFilter: imageFileFilter
});


router.post('/product',upload.single('productPicture'), async (req, res) => {
    const post = new Product({
        ...req.body,
        productPicture: req.file.filename,
    });

    try {
        await post.save();
        console.log(post);

        QRCode.toFile('./images/QRCode/' + req.body.productName + '.png', req.body.productName, {
            color: {
                dark: '#111',
                light: '#fff' // Transparent background
            }
        }, function (err) {
            if (err) throw err
            console.log('QR Generated in /images/QRCode folder')
        })

        res.status(201).send(post)
    } catch (error) {
        res.status(400).send(error)
    }
});

//get all products
router.get('/product', async (req, res) => {
    try {
        const posts = await Product.find({});
        res.send(posts)
    } catch (error) {
        res.status(500).send()
    }
});

//get product by name
router.post('/product/:name', async (req, res) => {
    const productName = req.params.name;
    try {
        const post = await Product.findOne({productName});
        if (!post) {
            return res.status(404).send()
        }
        res.send(post);
    } catch (error) {
        res.status(500).send()
    }
});

router.delete('/product/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const deletepost = await Product.findOneAndDelete({productName: name});
        if (!deletepost) {
            return res.status(404).send();
        }
        res.send(deletepost)
    } catch (error) {
        res.status(500).send()
    }
});



module.exports = router;

