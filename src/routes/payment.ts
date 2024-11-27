import express, { NextFunction, Request, Response } from "express";
import {
  constructWebhookEvent,
  createCheckoutSession,
  fulfillCheckout,
} from "../services/stripe";
import { webhookEndpointSecret } from "../config/config";
import logger from "../utils/logger";

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
