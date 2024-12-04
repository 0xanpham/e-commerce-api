import dotenv from "dotenv";
import { App } from "./app";

dotenv.config();

const port = process.env.PORT || "3000";

const app = new App(parseInt(port));

if (process.env.NODE_ENV !== "test") {
  app.listen();
}

export { app };
