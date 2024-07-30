import { Router, Request, Response } from "express";

import { authentication } from "../middlewares/auth";

import { IProduct, ProductModel } from "../models/product";
import { IUser, UserModel } from "../models/user";

import { ProductErrors, UserErrors } from "../enums/errors";

const productRouter = Router();

// GET ALL PRODUCTS //
productRouter.get("/", authentication, async (_, res: Response) => {
  try {
    const products: IProduct[] = await ProductModel.find({});

    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ type: err });
  }
});

// GET ALL PURCHASED PRODUCTS BY USER //
productRouter.get(
  "/purchased-products",
  authentication,
  async (req: Request, res: Response) => {
    try {
      const user: IUser = await UserModel.findById(req.userId);

      if (!user) {
        return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      }

      const purchasedProducts = await ProductModel.find({
        _id: { $in: user.purchasedItems },
      });

      return res.json({ purchasedProducts });
    } catch (err) {
      return res.status(500).json({ type: err });
    }
  }
);

// CHECKOUT //
productRouter.post(
  "/checkout",
  authentication,
  async (req: Request, res: Response) => {
    try {
      const { cartProducts } = req.body;

      // get user from db //
      const user = await UserModel.findById(req.userId);

      // get products from db //
      const productIds = Object.keys(cartProducts);
      const products = await ProductModel.find({ _id: { $in: productIds } });

      // user DNE //
      if (!user) {
        return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      }

      // all products DNE //
      if (products.length !== productIds.length) {
        return res
          .status(400)
          .json({ type: ProductErrors.NOT_ALL_PRODUCTS_FOUND });
      }

      // check product quantity & calculate total price //
      let totalPrice: number = 0;
      for (const idKey in cartProducts) {
        const product = products.find(
          (product) => String(product._id) === idKey
        );

        if (!product) {
          return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
        }

        if (product.stockQuantity < cartProducts[idKey]) {
          return res
            .status(400)
            .json({ type: ProductErrors.INSUFFICIENT_STOCK });
        }

        totalPrice += product.price * cartProducts[idKey];
      }

      // user not enough funds //
      if (user.availableMoney < totalPrice) {
        return res.status(400).json({ type: UserErrors.INSUFFICIENT_FUNDS });
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
