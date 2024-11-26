import mongoose from "mongoose";
import logger from "../utils/logger";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("Connect DB successfully");
  } catch {
    logger.error("Failed to connect DB");
    process.exit(1);
  }
}

export { connectDB };
