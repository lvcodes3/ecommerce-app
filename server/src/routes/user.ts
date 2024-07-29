import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { authentication } from "../middlewares/auth";

import { IUser, UserModel } from "../models/user";

import { UserErrors } from "../enums/errors";

const userRouter = Router();

// REGISTER //
userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user: IUser = await UserModel.findOne({ username });

    // username already exists //
    if (user) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    // hash password //
    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    // register //
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    return res.json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ type: err });
  }
});

// LOGIN //
userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user: IUser = await UserModel.findOne({ username });

    // user DNE //
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    // invalid password //
    if (!passwordMatch) {
      return res.status(400).json({ type: UserErrors.INVALID_CREDENTIALS });
    }

    // create jsonwebtoken //
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    return res.json({ token });
    // userId: user._id
  } catch (err) {
    return res.status(500).json({ type: err });
  }
});

// BALANCE //
userRouter.get(
  `/balance`,
  authentication,
  async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.userId);

      // user DNE //
      if (!user) {
        return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      }

      return res.json({ balance: user.availableMoney });
    } catch (err) {
      return res.status(500).json({ type: err });
    }
  }
);

export default userRouter;
