import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { IUser, UserModel } from "../models/user";
import { UserErrors } from "../errors";

const userRouter = Router();

// REGISTER //
userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // check if username already exists //
    const user: IUser = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    // hash password //
    const saltRounds: number = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user //
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

    // check if username already exists //
    const user: IUser = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    // check password //
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
    }

    // create jsonwebtoken //
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({ token, userId: user._id });
  } catch (err) {
    return res.status(500).json({ type: err });
  }
});

// LOGOUT //
userRouter.get("/logout", async (req: Request, res: Response) => {});

// JWT MIDDLEWARE //
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // token exists //
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SECRET, (err) => {
      // invalid //
      if (err) {
        return res.sendStatus(403);
      }

      // valid //
      next();
    });
  }

  // token does not exist //
  return res.sendStatus(401);
};

export default userRouter;
