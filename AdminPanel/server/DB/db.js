const mongoose = require('mongoose');

const connection = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/adminpanel";
        await mongoose.connect(mongoUri);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed:", error);
    }
}

module.exports = connection;