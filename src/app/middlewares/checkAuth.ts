// import { NextFunction, Request, Response } from "express";
// import AppError from "../errorHelpers/AppError";
// import status from "http-status";
// import { prisma } from "../lib/prisma";
// import { envVars } from "../config/env";
// import { cookieUtils } from "../utils/cookie";
// import { jwtUtils } from "../utils/jwt";
// import { UserRole } from "@prisma/client";

// export const checkAuth =
//   (...authRoles: UserRole[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const sessionToken = cookieUtils.getCookie(
//         req,
//         "better-auth.session_token"
//       );

//       // --- Path 1: Session token auth ---
//       if (sessionToken) {
//         const sessionExists = await prisma.session.findFirst({
//           where: {
//             token: sessionToken,
//             expiresAt: { gt: new Date() },
//           },
//           include: { user: true },
//         });

//         if (!sessionExists?.user) {
//           throw new AppError(status.UNAUTHORIZED, "Invalid or expired session");
//         }

//         const user = sessionExists.user;

//         // Warn client if session is expiring soon
//         const now = Date.now();
//         const expiresAt = new Date(sessionExists.expiresAt).getTime();
//         const createdAt = new Date(sessionExists.createdAt).getTime();
//         const sessionLifetime = expiresAt - createdAt;
//         const timeRemaining = expiresAt - now;
//         const percentRemaining = (timeRemaining / sessionLifetime) * 100;

//         if (percentRemaining < 20) {
//           res.setHeader("X-Session-Refresh", "true");
//           res.setHeader(
//             "X-Session-Expires-At",
//             new Date(expiresAt).toISOString()
//           );
//           res.setHeader("X-Time-Remaining", timeRemaining.toString());
//         }

//         if (user.isDeleted) {
//           throw new AppError(
//             status.UNAUTHORIZED,
//             "Unauthorised access! User has been deleted"
//           );
//         }

//         if (authRoles.length > 0 && !authRoles.includes(user.role)) {
//           throw new AppError(
//             status.FORBIDDEN,
//             "Forbidden access! You do not have permission to access this resource"
//           );
//         }

//         return next(); 
//       }

//       // --- Path 2: JWT access token auth (fallback) ---
//       const accessToken = cookieUtils.getCookie(req, "accessToken");
//       if (!accessToken) {
//         throw new AppError(
//           status.UNAUTHORIZED,
//           "Unauthorised access! No token provided"
//         );
//       }

//       const verifiedToken = jwtUtils.verifyToken(
//         accessToken,
//         envVars.JWT_SECRET
//       );
//       if (!verifiedToken.success) {
//         throw new AppError(
//           status.UNAUTHORIZED,
//           "Unauthorised access! Invalid access token"
//         );
//       }

//       if (
//         authRoles.length > 0 &&
//         !authRoles.includes(verifiedToken.data!.role as UserRole)
//       ) {
//         throw new AppError(
//           status.FORBIDDEN,
//           "Forbidden access! You are not allowed to access this resource"
//         );
//       }

//       return next();
//     } catch (error) {
//       next(error);
//     }
//   };
