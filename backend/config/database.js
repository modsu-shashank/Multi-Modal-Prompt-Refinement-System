const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use 127.0.0.1 instead of localhost to avoid IPv6/IPv4 issues on Windows
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/prompt-refinement";

    // Avoid deprecated options (driver >=4.0 ignores them)
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.error("\n⚠️  MongoDB is not running. Please:");
    console.error(
      "   1. Install MongoDB from https://www.mongodb.com/try/download/community"
    );
    console.error("   2. Start MongoDB service: net start MongoDB (Windows)");
    console.error(
      "   3. Or use MongoDB Atlas (cloud): Set MONGODB_URI in .env file"
    );
    console.error(
      "\n   The server will continue to run, but database features will not work.\n"
    );
    // Don't exit - allow server to run without DB for development
    // process.exit(1);
  }
};

module.exports = connectDB;
