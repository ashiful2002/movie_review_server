import { UserRole, UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access. Token not found",
        });
      }

      const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;
      const userData = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });
    //   console.log(userData);
      
      if (!userData) {
        throw new Error("unauthorised");
      }
      if (userData.status !== UserStatus.ACTIVE) {
        throw new Error("unauthorised");
      }
      // Role check (optional)
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You are not authorized",
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
