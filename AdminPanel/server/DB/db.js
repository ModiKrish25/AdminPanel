const mongoose = require('mongoose');

const connection = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/adminpanel";

        // Options to help with debugging and stability
        await mongoose.connect(mongoUri);

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error; // Propagate the error so the server knows connection failed
    }
}

module.exports = connection;