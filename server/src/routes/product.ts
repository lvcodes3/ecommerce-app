import { Router, Request, Response } from "express";

import { IProduct, ProductModel } from "../models/product";

const productRouter = Router();

// GET ALL PRODUCTS //
productRouter.get("/", async (_, res: Response) => {
  try {
    const products: IProduct[] = await ProductModel.find({});

    if (products) {
      return res.json({ products });
    }
  } catch (err) {
    return res.status(500).json({ type: err });
  }
});

export default productRouter;
