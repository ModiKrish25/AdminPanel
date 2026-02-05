const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: String,
    image: String
});

module.exports = mongoose.model('Menu', menuSchema);
