import express from "express";
import { AuthController } from "./auth.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// public
router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);

// protected
router.post("/logout", auth(UserRole.USER), AuthController.logoutUser);
router.get("/me", auth(UserRole.USER || UserRole.ADMIN), AuthController.getMe);
router.patch("/me", auth(UserRole.USER), AuthController.updateProfile);

export const AuthRoutes = router;
