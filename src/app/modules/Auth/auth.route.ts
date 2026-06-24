import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

// public
router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);

// protected
router.post(
  "/logout",
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.logoutUser
);
router.get("/me", auth(UserRole.ADMIN, UserRole.USER), AuthController.getMe);
router.patch(
  "/me",
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.updateProfile
);

export const AuthRoutes = router;
