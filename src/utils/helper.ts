import { NextFunction, Request, Response } from "express";

function unless(path: string, middleware: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}

export { unless };
