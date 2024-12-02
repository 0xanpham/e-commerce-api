import { NextFunction, Request, Response } from "express";
import { AnyObject, ObjectSchema } from "yup";
import { validateDto } from "../services/dto";

function dtoValidationMiddleware(schema: ObjectSchema<AnyObject>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateDto(schema, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export { dtoValidationMiddleware };
