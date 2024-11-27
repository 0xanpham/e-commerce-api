import express, { Express } from "express";
import { errorMiddleware } from "./middlewares/error";
import authRouter from "./routes/auth";
import logger from "./utils/logger";
import mongoose from "mongoose";
import { dbURI } from "./config/config";
import productRouter from "./routes/product";

export class App {
  public app: Express;
  public port: number;

  constructor(port: number) {
    this.connectDB();
    this.app = express();
    this.port = port;
    this.app.use(express.json());
    this.app.use("/auth", authRouter);
    this.app.use("/product", productRouter);
    this.app.use(errorMiddleware);
  }

  private async connectDB() {
    try {
      await mongoose.connect(dbURI);
      logger.info("Connect DB successfully");
    } catch {
      logger.error("Failed to connect DB");
      process.exit(1);
    }
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`Server is running at http://localhost:${this.port}`);
    });
  }
}
