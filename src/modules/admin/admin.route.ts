import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.get("/orders", auth(UserRole.ADMIN), AdminController.getAllOrders);
router.get("/users/:id", auth(UserRole.ADMIN), AdminController.getSingleUser);
router.patch(
  "/users/:id/role",
  auth(UserRole.ADMIN),
  AdminController.makeProvider
);

export const AdminRoutes = router;
