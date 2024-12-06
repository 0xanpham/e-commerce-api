import express, { NextFunction, Request, Response } from "express";
import { getInventoriesByUser } from "../services/inventory";

const inventoryRouter = express.Router();

inventoryRouter.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const inventories = await getInventoriesByUser(userId);
      res.status(200).json({ inventories });
    } catch (error) {
      next(error);
    }
  }
);

export default inventoryRouter;
