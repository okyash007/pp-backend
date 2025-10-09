import mongoose from "mongoose";

export async function connectToMongoDB() {
  
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
        socketTimeoutMS: 30000, // Increase socket timeout
        maxPoolSize: 20, 
      });
      console.log("💿 Connected to MongoDB");
  
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }