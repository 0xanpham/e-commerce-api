import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.ObjectId,
      required: true,
    },
    customer: {
      type: Object,
      required: true,
    },
    lineItems: {
      type: [Object],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", userSchema);

export { Payment };
