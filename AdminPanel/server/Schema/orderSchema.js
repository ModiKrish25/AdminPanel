const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: String,
    userEmail: String,
    items: [
        {
            id: String,
            title: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],
    amount: Number,
    shippingFee: {
        type: Number,
        default: 30
    },
    address: {
        fullName: String,
        email: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zip: String
    },
    status: {
        type: String,
        default: 'Order Placed',
        enum: ['Order Placed', 'Preparing', 'Completed', 'Cancelled']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
