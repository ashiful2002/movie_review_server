import express from "express";
import { AuthController } from "./admin.controller";

const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/logout", AuthController.logoutUser);

export const AdminRoutes = router;
