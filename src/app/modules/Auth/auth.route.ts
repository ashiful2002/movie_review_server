import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);

router.post(
  "/logout",
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.logoutUser
);

export const AuthRoutes = router;
