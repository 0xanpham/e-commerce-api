import express, { NextFunction, Request, Response } from "express";
import { adminMiddleware, tokenMiddleware } from "../middlewares/auth";
import {
  createProduct,
  getPrice,
  getProduct,
  getProducts,
} from "../services/stripe";
import { dtoValidationMiddleware } from "../middlewares/dto";
import { productSchema } from "../schemas/dto";

const productRouter = express.Router();

productRouter.post(
  "/create",
  tokenMiddleware,
  adminMiddleware,
  dtoValidationMiddleware(productSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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

productRouter.get(
  "/:productId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const product = await getProduct(productId);
      const price = await getPrice(product.default_price?.toString() || "");
      res.status(200).json({ product, price });
    } catch (error) {
      next(error);
    }
  }
);

export default productRouter;
