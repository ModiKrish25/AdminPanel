const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: {
        type: String,
        default: 'Customer'
    },
    status: {
        type: String,
        default: 'Inactive'
    },
    joinDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
