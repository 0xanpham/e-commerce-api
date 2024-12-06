import { ClientSession } from "mongoose";
import { IInventory, Inventory } from "../models/inventory";
import { docToPlainObj } from "../utils/helper";

async function updateInventory(
  userId: string,
  productId: string,
  quantity: number,
  session?: ClientSession
): Promise<IInventory> {
  let inventory = await Inventory.findOne(
    {
      userId,
      productId,
    },
    undefined,
    { session }
  );
  if (!inventory) {
    inventory = new Inventory({
      userId,
      productId,
      quantity,
    });
    await inventory.save({ session });
  } else {
    inventory = await Inventory.findByIdAndUpdate(
      inventory._id,
      {
        quantity: inventory.quantity + quantity,
      },
      { session }
    );
  }
  return docToPlainObj(inventory!);
}

async function getInventoriesByUser(userId: string): Promise<IInventory[]> {
  const inventories = await Inventory.find({ userId });
  return inventories.map((inventory) => docToPlainObj(inventory));
}

export { updateInventory, getInventoriesByUser };
