import express, { NextFunction, Request, Response } from "express";
import { getInventoriesByUser } from "../services/inventory";
import { tokenMiddleware } from "../middlewares/auth";
import { HttpException } from "../exceptions/exception";

const inventoryRouter = express.Router();

inventoryRouter.get(
  "/:userId",
  tokenMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req.body;
      const { userId } = req.params;
      if (user._id !== userId) {
        throw new HttpException(
          401,
          "user can only view his/her own inventory"
        );
      }
      const inventories = await getInventoriesByUser(userId);
      res.status(200).json({ inventories });
    } catch (error) {
      next(error);
    }
  }
);

export default inventoryRouter;
