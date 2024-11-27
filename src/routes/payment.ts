import express, { NextFunction, Request, Response } from "express";
import { createCheckoutSession } from "../services/stripe";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const { priceId, quantity } = req.body;
      const priceId = "price_1QPiezIkLJDdtMY0g5IT7akA";
      const quantity = 10;
      const session = await createCheckoutSession(priceId, quantity);
      if (!session.url) throw new Error("Null stripe session url");
      res.status(303).redirect(session.url);
    } catch (error) {
      next(error);
    }
  }
);

export default paymentRouter;
