import express, { NextFunction, Request, Response } from "express";
import { createUser, findUser } from "../services/user";
import { comparePassword, createToken } from "../services/auth";
import { HttpException } from "../exceptions/exception";
import { dtoValidationMiddleware } from "../middlewares/dto";
import { signInSchema, signUpSchema } from "../schemas/dto";

const authRouter = express.Router();

authRouter.post(
  "/sign-up",
  dtoValidationMiddleware(signUpSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, role } = req.body;
      const exist = await findUser(username);
      if (exist) {
        throw new HttpException(400, "user is already existed");
      }
      const user = await createUser(username, password, role);
      const accessToken = createToken(user);
      res.status(201).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/sign-in",
  dtoValidationMiddleware(signInSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const user = await findUser(username);
      if (!user) {
        throw new HttpException(400, "user does not exist");
      }
      const match = await comparePassword(password, user.password!);
      if (!match) {
        throw new HttpException(400, "wrong password");
      }
      const accessToken = createToken(user);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
