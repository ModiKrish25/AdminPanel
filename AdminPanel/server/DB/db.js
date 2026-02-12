const mongoose = require('mongoose');

const connection = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error("ERROR: MONGO_URI is not defined in the environment variables!");
            console.info("Defaulting to local URI, but this will likely fail on Render.");
        }

        console.log("Attempting to connect to MongoDB...");
        const targetUri = mongoUri || "mongodb://127.0.0.1:27017/adminpanel";

        // Enable buffering so operations wait for the connection instead of crashing
        mongoose.set('bufferCommands', true);

        await mongoose.connect(targetUri);

        console.log("Database connected successfully. Connection State:", mongoose.connection.readyState);
    } catch (error) {
        console.error("DATABASE CONNECTION ERROR:", error.message);
        throw error;
    }
}

module.exports = connection;