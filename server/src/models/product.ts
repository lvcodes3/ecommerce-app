import { model, Schema } from "mongoose";

export interface IProduct {
  productName: string;
  price: number;
  description: string;
  imageURL: string;
  stockQuantity: number;
}

const ProductSchema = new Schema<IProduct>({
  productName: {
    type: "string",
    required: true,
  },
  price: {
    type: "number",
    min: [1, "Product price must be at least 1"],
    required: true,
  },
  description: {
    type: "string",
    required: true,
  },
  imageURL: {
    type: "string",
    required: true,
  },
  stockQuantity: {
    type: "number",
    min: [0, "Product stock must be at least 0"],
    required: true,
  },
});

export const ProductModel = model<IProduct>("product", ProductSchema);
