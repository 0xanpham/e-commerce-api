import { NextFunction, Request, Response } from "express";
import { mixed, object, string, ValidationError } from "yup";
import { verifyToken } from "../services/auth";
import { Role } from "../models/user";

const signUpSchema = object({
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
  role: mixed<Role>().oneOf(Object.values(Role), "Invalid role"),
});

const signInSchema = object({
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

async function validateSignUpDto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = await signUpSchema.validate(req.body);
    next();
  } catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

async function validateSignInDto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = await signInSchema.validate(req.body);
    next();
  } catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

async function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Unauthenticated request");
    }
    verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Unauthenticated request" });
  }
}

export { validateSignUpDto, validateSignInDto, validateToken };
