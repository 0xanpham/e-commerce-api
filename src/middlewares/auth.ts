import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/auth";
import { Role } from "../models/user";
import { HttpException } from "../exceptions/exception";

async function tokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new HttpException(401, "Unauthenticated request");
    }
    const user = verifyToken(token);
    req.body.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

async function customerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const role = req.body.user.role;
    if (role !== Role.Customer) {
      throw new HttpException(403, "Unauthorized request");
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const role = req.body.user.role;
    if (role !== Role.Admin) {
      throw new HttpException(403, "Unauthorized request");
    }
    next();
  } catch (error) {
    next(error);
  }
}

export { tokenMiddleware, customerMiddleware, adminMiddleware };
