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
router.get("/me", auth(UserRole.ADMIN, UserRole.USER), AuthController.getMe);

router.post("/refresh-token", AuthController.getNewToken);
// router.post(
//   "/change-password",
//   checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
//   AuthController.changePassword
// );
router.post(
  "/logout",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  AuthController.logoutUser
);

export const AuthRoutes = router;
