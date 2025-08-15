/**
 * Database Configuration Module
 * 
 * This module handles the MongoDB database connection using Mongoose ODM.
 * It exports a function that establishes and manages the database connection.
 * 
 * IMPORTANT SECURITY NOTE: In production, the database connection string
 * should be stored in environment variables, not hardcoded in the source code.
 */

const mongoose = require("mongoose");

/**
 * Connect to MongoDB Database
 * 
 * This function establishes a connection to the MongoDB database using Mongoose.
 * Mongoose provides an elegant way to interact with MongoDB by providing
 * schema-based modeling, validation, and query building.
 * 
 * @returns {Promise} - Resolves when connection is established
 * 
 * @example
 * // Usage in app.js
 * connectDB()
 *   .then(() => console.log("Connected to MongoDB"))
 *   .catch(err => console.error("Connection failed:", err));
 */
const connectDB = async () => {
    try {
        // MongoDB connection string format:
        // mongodb+srv://username:password@cluster.mongodb.net/database_name
        const connectionString = "mongodb+srv://karansingh36752:FUtTnQBSdT12djOJ@nodejsnamaste.xfmxb.mongodb.net/Trawell";
        
        // Connect to MongoDB with connection options
        await mongoose.connect(connectionString, {
            // These options are recommended for production applications
            useNewUrlParser: true,        // Use new URL parser (deprecated but safe to keep)
            useUnifiedTopology: true,    // Use new server discovery and monitoring engine
            
            // Connection timeout settings
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000,         // Timeout for socket operations
            
            // Connection pool settings
            maxPoolSize: 10,                // Maximum number of connections in the pool
            minPoolSize: 2,                 // Minimum number of connections in the pool
            
            // Retry settings
            retryWrites: true,              // Retry write operations if they fail
            w: 'majority'                   // Wait for majority of replica set members
        });
        
        console.log("🔗 MongoDB connection established successfully");
        
        // Handle connection events for monitoring
        mongoose.connection.on('connected', () => {
            console.log("✅ Mongoose connected to MongoDB");
        });
        
        mongoose.connection.on('error', (err) => {
            console.error("❌ Mongoose connection error:", err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log("⚠️ Mongoose disconnected from MongoDB");
        });
        
        // Graceful shutdown handling
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log("🔄 MongoDB connection closed through app termination");
            process.exit(0);
        });
        
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        throw error; // Re-throw the error so the calling code can handle it
    }
};

// Export the connection function
module.exports = connectDB;

/**
 * PRODUCTION SECURITY CHECKLIST:
 * 
 * 1. Move database credentials to environment variables:
 *    - Create a .env file
 *    - Use process.env.MONGODB_URI
 *    - Add .env to .gitignore
 * 
 * 2. Example .env file:
 *    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
 *    JWT_SECRET=your_jwt_secret_key_here
 * 
 * 3. Update this file to use:
 *    const connectionString = process.env.MONGODB_URI;
 * 
 * 4. Install dotenv package: npm install dotenv
 * 5. Load environment variables in app.js: require('dotenv').config()
 */

