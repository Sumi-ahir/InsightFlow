import mongoose from "mongoose";
import dns from "node:dns";

// Google DNS વાપરો
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;