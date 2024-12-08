import express, { Express } from "express";
import { errorMiddleware } from "./middlewares/error";
import authRouter from "./routes/auth";
import logger from "./utils/logger";
import mongoose from "mongoose";
import productRouter from "./routes/product";
import cors from "cors";
import paymentRouter from "./routes/payment";
import { unless } from "./utils/helper";
import inventoryRouter from "./routes/inventory";

export class App {
  public app: Express;
  public port: number;

  constructor(port: number, dbURI: string) {
    this.connectDB(dbURI);
    this.app = express();
    this.port = port;
    this.app.use(cors());
    this.app.use(unless("/payment/webhook", express.json()));
    this.app.use("/auth", authRouter);
    this.app.use("/products", productRouter);
    this.app.use("/payment", paymentRouter);
    this.app.use("/inventories", inventoryRouter);
    this.app.get("/health", (req, res) => {
      res.status(200).send("Server is healthy");
    });
    this.app.use(errorMiddleware);
  }

  async connectDB(dbURI: string) {
    try {
      await mongoose.connect(dbURI);
      logger.info("Connect DB successfully");
    } catch {
      logger.error("Failed to connect DB");
      process.exit(1);
    }
  }

  public listen() {
    return this.app.listen(this.port, () => {
      logger.info(`Server is running at port ${this.port}`);
    });
  }
}
