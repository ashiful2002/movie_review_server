import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ allow preflight
      if (req.method === "OPTIONS") {
        return next();
      }

      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access. Token not found",
        });
      }

      // ✅ FIX HERE
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;

      const userData = await prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

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
