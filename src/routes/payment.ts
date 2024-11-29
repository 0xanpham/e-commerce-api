import express, { NextFunction, Request, Response } from "express";
import {
  constructWebhookEvent,
  createCheckoutSession,
  fulfillCheckout,
} from "../services/stripe";
import { webhookEndpointSecret } from "../config/config";
import logger from "../utils/logger";
import { customerMiddleware, tokenMiddleware } from "../middlewares/auth";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  tokenMiddleware,
  customerMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, priceId, quantity } = req.body;
      const session = await createCheckoutSession(user.id, priceId, quantity);
      if (!session.url) throw new Error("Null stripe session url");
      res.status(200).json({ session });
    } catch (error) {
      next(error);
    }
  }
);

paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    logger.info("Webhook called");
    const payload = req.body;
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = constructWebhookEvent(payload, sig, webhookEndpointSecret);
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (
      event?.type === "checkout.session.completed" ||
      event?.type === "checkout.session.async_payment_succeeded"
    ) {
      fulfillCheckout(event.data.object.id);
    }

    res.status(200).end();
  }
);

export default paymentRouter;
