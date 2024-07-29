import { Router, Request, Response } from "express";

import { IProduct, ProductModel } from "../models/product";
import { UserModel } from "../models/user";

import { verifyToken } from "../middlewares/auth";

import { ProductErrors, UserErrors } from "../enums/errors";

const productRouter = Router();

// GET ALL PRODUCTS //
productRouter.get("/", verifyToken, async (_, res: Response) => {
  try {
    const products: IProduct[] = await ProductModel.find({});
    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ type: err });
  }
});

// CHECKOUT //
productRouter.post(
  "/checkout",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { userId, userProducts } = req.body;

      // get user from db //
      const user = await UserModel.findById(userId);

      // get products from db //
      const productIds = Object.keys(userProducts);
      const products = await ProductModel.find({ _id: { $in: productIds } });

      // check if user exists //
      if (!user) {
        return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      }

      // check that all products exist //
      if (products.length !== productIds.length) {
        return res.status(400).json({ type: ProductErrors.NO_PRODUCTS_FOUND });
      }

      // check product quantity & calculate total price //
      let totalPrice: number = 0;
      for (const idKey in userProducts) {
        const product = products.find(
          (product) => String(product._id) === idKey
        );

        if (!product) {
          return res
            .status(400)
            .json({ type: ProductErrors.NO_PRODUCTS_FOUND });
        }

        if (product.stockQuantity > userProducts[idKey]) {
          return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
        }

        totalPrice += product.price * userProducts[idKey];
      }

      // check user funds //
      if (user.availableMoney < totalPrice) {
        return res.status(400).json({ type: UserErrors.NOT_ENOUGH_FUNDS });
      }

      // purchase //
      user.availableMoney -= totalPrice;
      user.purchasedItems.push(...productIds);
      await user.save();

      await ProductModel.updateMany(
        {
          _id: { $in: productIds },
        },
        { $inc: { stockQuantity: -1 } }
      );

      return res.json({ purchasedItems: user.purchasedItems });
    } catch (err) {
      return res.status(500).json({ type: err });
    }
  }
);

export default productRouter;
