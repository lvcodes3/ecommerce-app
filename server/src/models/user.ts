import { model, Schema } from "mongoose";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
  availableMoney: number;
  purchasedItems: string[];
}

const UserSchema = new Schema<IUser>({
  username: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  availableMoney: {
    type: "number",
    default: 5000,
  },
  purchasedItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "product",
      default: [],
    },
  ],
});

export const UserModel = model<IUser>("user", UserSchema);
