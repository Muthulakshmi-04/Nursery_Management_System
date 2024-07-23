const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    plantName: String,
    quantity: Number
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
