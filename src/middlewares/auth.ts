import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/auth";
import { Role } from "../models/user";
import { HttpException } from "../exceptions/exception";
import { validateSignInDto, validateSignUpDto } from "../services/dto";

async function signUpMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await validateSignUpDto(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

async function signInMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await validateSignInDto(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

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

async function buyerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const role = req.body.user.role;
    if (role !== Role.Buyer) {
      throw new HttpException(403, "Unauthorized request");
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function sellerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const role = req.body.user.role;
    if (role !== Role.Seller) {
      throw new HttpException(403, "Unauthorized request");
    }
    next();
  } catch (error) {
    next(error);
  }
}

export {
  signUpMiddleware,
  signInMiddleware,
  tokenMiddleware,
  buyerMiddleware,
  sellerMiddleware,
};
