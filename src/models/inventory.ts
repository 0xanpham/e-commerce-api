import mongoose, { Schema } from "mongoose";

export interface IInventory {
  _id: string;
  userId: string;
  productId: string;
  productName: string;
  image?: string;
  quantity: number;
}

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ userId: 1, productId: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", inventorySchema);

export { Inventory };
