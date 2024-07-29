import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user";

import { UserErrors } from "../enums/errors";

// extending express request to hold optional userId //
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

// authenticate jsonwebtoken //
export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get jwt value => passed in the headers from the client's cookies //
  const jwtValue = req.headers.authorization;

  // jwt exists //
  if (jwtValue) {
    try {
      // authenticate jwt //
      const decodedJWT = jwt.verify(jwtValue, process.env.JWT_SECRET) as {
        userId: string;
      };

      const user = await UserModel.findById(decodedJWT.userId);

      if (!user) {
        return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      }

      // set userId in req //
      req.userId = user._id;

      // go to next route //
      next();
    } catch (err) {
      // invalid jwt //
      return res.sendStatus(403);
    }
  }
  // jwt DNE //
  else {
    return res.sendStatus(401);
  }
};
