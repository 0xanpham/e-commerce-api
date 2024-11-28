import Stripe from "stripe";
import { stripeSecretKey } from "../config/config";
import logger from "../utils/logger";
import { Payment } from "../models/payment";

const stripe = new Stripe(stripeSecretKey);

async function createProduct(
  name: string,
  price: number,
  description?: string,
  images?: string[]
) {
  let dto: Stripe.ProductCreateParams = {
    name,
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  };
  images && (dto.images = images);
  description && (dto.description = description);
  const product = await stripe.products.create(dto);
  return product;
}

async function getProducts(limit = 10, active = true) {
  return stripe.products.list({ limit, active });
}

async function createCheckoutSession(
  userId: string,
  priceId: string,
  quantity: number
) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000",
    client_reference_id: userId,
  });
  return session;
}

async function fulfillCheckout(sessionId: string) {
  logger.info("Fulfilling Checkout Session " + sessionId);
  const payment = await Payment.findOne({ sessionId });
  if (payment) {
    logger.info("Payment already fulfilled");
    return;
  } else {
    logger.info("Payment is not fulfilled");
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (checkoutSession.payment_status !== "unpaid") {
    logger.info(`Save payment for user ${checkoutSession.client_reference_id}`);
    const newPayment = new Payment({
      sessionId,
      customer: checkoutSession.customer_details,
      lineItems: checkoutSession.line_items,
    });
    await newPayment.save();
  }
}

function constructWebhookEvent(
  payload: any,
  signature: any,
  endpointSecret: any
) {
  return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
}

export {
  createProduct,
  getProducts,
  createCheckoutSession,
  fulfillCheckout,
  constructWebhookEvent,
};
