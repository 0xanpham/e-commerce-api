import { NextFunction, Request, Response } from "express";
import { object, string, ValidationError } from "yup";
import logger from "../utils/logger";

const newUserSchema = object({
  username: string()
    .min(6)
    .max(20)
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "Username must contain alphanumeric characters"
    ),
  password: string()
    .min(6)
    .max(20)
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "Password must contain alphanumeric characters"
    ),
});

async function validateNewUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = await newUserSchema.validate(req.body);
    next();
  } catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export { validateNewUser };
