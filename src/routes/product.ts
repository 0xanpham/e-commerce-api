import express, { NextFunction, Request, Response } from "express";
import { adminMiddleware, tokenMiddleware } from "../middlewares/auth";
import { validateProductDto } from "../services/dto";
import { createProduct, getProducts } from "../services/stripe";

const productRouter = express.Router();

productRouter.post(
  "/create",
  tokenMiddleware,
  adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateProductDto(req.body);
      const { name, price, description, images } = req.body;
      const product = await createProduct(name, price, description, images);
      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }
);

productRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await getProducts();
      res.status(200).json({ products: products.data });
    } catch (error) {
      next(error);
    }
  }
);

export default productRouter;
