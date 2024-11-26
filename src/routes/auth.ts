import express, { Request, Response } from "express";
import { createUser, findUser } from "../services/user";
import { validateSignInDto, validateSignUpDto } from "../middlewares/auth";
import { comparePassword, createToken } from "../services/auth";

const authRouter = express.Router();

authRouter.post(
  "/sign-up",
  validateSignUpDto,
  async (req: Request, res: Response) => {
    try {
      const { username, password, role } = req.body;
      const user = await createUser(username, password, role);
      const accessToken = createToken(user);
      res.status(201).json({ accessToken });
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

authRouter.post(
  "/sign-in",
  validateSignInDto,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await findUser(username);
      if (!user) {
        throw new Error("User does not exist");
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        throw new Error("Wrong password");
      }
      const accessToken = createToken(user);
      res.status(201).json({ accessToken });
    } catch (error: any) {
      if (error.message) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
);

export default authRouter;
