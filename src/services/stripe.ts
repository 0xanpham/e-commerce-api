import Stripe from "stripe";
import {
  stripeCancelUrl,
  stripeSecretKey,
  stripeSuccessUrl,
} from "../config/config";
import logger from "../utils/logger";
import { Payment } from "../models/payment";
import { HttpException } from "../exceptions/exception";
import { updateInventory } from "./inventory";
import { ClientSession } from "mongoose";

const stripe = new Stripe(stripeSecretKey);

async function getPrice(priceId: string) {
  return stripe.prices.retrieve(priceId);
}

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

async function getProduct(productId: string) {
  return stripe.products.retrieve(productId);
}

async function createCheckoutSession(
  userId: string,
  priceId: string,
  quantity: number
) {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: "payment",
      success_url: stripeSuccessUrl,
      cancel_url: stripeCancelUrl,
      client_reference_id: userId,
    });
    return session;
  } catch (error: any) {
    throw new HttpException(500, error.message, error);
  }
}

async function fulfillCheckout(sessionId: string, session?: ClientSession) {
  logger.info("Fulfilling Checkout Session " + sessionId);
  const payment = await Payment.findOne({ sessionId }, undefined, { session });
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
    logger.info(
      `Save payment for user with id ${checkoutSession.client_reference_id}`
    );
    const newPayment = new Payment({
      sessionId,
      customer: checkoutSession.customer_details,
      lineItems: checkoutSession.line_items,
      userId: checkoutSession.client_reference_id,
    });
    await newPayment.save({ session });
    const product = await getProduct(
      checkoutSession.line_items?.data[0].price?.product.toString() || ""
    );
    await updateInventory(
      checkoutSession.client_reference_id || "",
      checkoutSession.line_items?.data[0].price?.product.toString() || "",
      product.name,
      checkoutSession.line_items?.data[0].quantity || 0,
      product.images.length ? product.images[0] : undefined,
      session
    );
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
  getPrice,
  getProducts,
  getProduct,
  createCheckoutSession,
  fulfillCheckout,
  constructWebhookEvent,
};
