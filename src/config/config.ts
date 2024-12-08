import dotenv from "dotenv";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || "";
export const dbURI = process.env.MONGO_URI || "";
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
export const webhookEndpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET || "";
export const stripeSuccessUrl = process.env.STRIPE_SUCCESS_URL || "";
export const stripeCancelUrl = process.env.STRIPE_CANCEL_URL || "";
export const whitelist = process.env.WHITELIST
  ? process.env.WHITELIST.split(",")
  : undefined;
