import express from "express";
import { AuthController } from "./admin.controller";

const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/logout", AuthController.logoutUser);

router.get("/me", AuthController.getMe);
router.patch("/me", AuthController.updateProfile);

export const AdminRoutes = router;