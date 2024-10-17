/**Singleton Pattern */
import mongoose from "mongoose";

let isConnected = false; // To track the connection status

const connectDB = async () => {
  if (isConnected) {
    console.log("Database connection already established.");
    return;
  }

  mongoose.connection.on("connected", () => {
    console.log("Database Connected");
    isConnected = true; // Set the connection flag to true after a successful connection
  });

  mongoose.connection.on("error", (err) => {
    console.error("DB connection error:", err);
    isConnected = false; // Reset flag on error
  });

  if (!isConnected) {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
  }
};

export default connectDB;
