import dotenv from "dotenv";
import { App } from "./app";
import { dbURI } from "./config/config";

dotenv.config();

const port = process.env.PORT || "3000";

const app = new App(parseInt(port), dbURI);

if (process.env.NODE_ENV !== "test") {
  app.listen();
}
