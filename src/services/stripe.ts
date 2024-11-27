import Stripe from "stripe";
import { stripeSecretKey } from "../config/config";

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

async function createCheckoutSession(priceId: string, quantity: number) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000",
  });
  return session;
}

export { createProduct, getProducts, createCheckoutSession };
