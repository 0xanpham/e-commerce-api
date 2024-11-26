import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRouter);

async function main() {
  try {
    await connectDB();

    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  } catch {
    logger.error("Error");
    process.exit(1);
  }
}

main();
