import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/exception";
import logger from "../utils/logger";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.stack);
  const status = error.status ? error.status : 500;
  const message = status === 500 ? "Internal server error" : error.message;
  const errors = error.error;
  res.status(status).json({ status, message, error: errors });
}

export { errorMiddleware };
