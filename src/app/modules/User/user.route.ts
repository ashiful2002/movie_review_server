import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get("/me", auth(UserRole.USER), UserController.getMe);
router.patch("/me", auth(UserRole.USER), UserController.updateProfile);
router.delete("/me", UserController.deleteUser);

router.get("/me/access/:movieId", UserController.checkAccess);
router.get("/me/purchases", auth(UserRole.USER), UserController.getMyPurchases);


export const UserRoutes = router;
