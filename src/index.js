const express = require('express');
const app = express();

require('dotenv').config();
require('./db/database');

const cors = require('cors');
const port = process.env.PORT;

const userRoutes = require('./router/user');
const ProductRoutes = require('./router/product');
const CartRoutes = require('./router/cart');


app.use(express.json( ));
app.use(require('body-parser').urlencoded({ extended: false }));

app.use(cors());
app.use(userRoutes);
app.use(ProductRoutes);
app.use(CartRoutes);

app.use('/profileImage', express.static('./images/userProfile'));
app.use('/productImage', express.static('./images/productImage'));

app.listen(port, () => {
    console.log('Server is up on ' + port);
});
