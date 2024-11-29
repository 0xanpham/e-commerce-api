import { NextFunction, Request, Response } from "express";
import { Document, Types } from "mongoose";

function unless(path: string, middleware: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}

function docToPlainObj(doc: Document) {
  let obj = doc.toObject();
  if (obj._id && obj._id instanceof Types.ObjectId) {
    obj = { ...obj, _id: obj._id.toString() };
  }
  return obj;
}

export { unless, docToPlainObj };
