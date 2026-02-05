const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    icon: String,
    menuItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }]
});

module.exports = mongoose.model('Category', categorySchema);
