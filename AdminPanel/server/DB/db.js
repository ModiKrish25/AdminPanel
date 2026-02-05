const mongoose = require('mongoose');

const connection = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect("mongodb://127.0.0.1:27017/adminpanel");
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed:", error);
    }
}

module.exports = connection;