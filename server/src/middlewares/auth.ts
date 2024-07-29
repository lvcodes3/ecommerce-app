import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
  } else {
    // token does not exist //
    return res.sendStatus(401);
  }
};
