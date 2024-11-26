import mongoose from "mongoose";
import logger from "../utils/logger";
import { dbURI } from "./env";

async function connectDB() {
  try {
    await mongoose.connect(dbURI);
    logger.info("Connect DB successfully");
  } catch {
    logger.error("Failed to connect DB");
    process.exit(1);
  }
}

export { connectDB };
