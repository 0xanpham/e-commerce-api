import express, { Request, Response } from "express";
import { createUser } from "../services/user";
import { validateNewUser } from "../middlewares/auth";

const authRouter = express.Router();

authRouter.post(
  "/sign-up",
  validateNewUser,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res
          .status(400)
          .json({ message: "Username and password must not be empty" });
      }
      const user = await createUser(username, password);
      res.status(201).json(user);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default authRouter;
