import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get("/me/access/:movieId", UserController.checkAccess);
router.get(
  "/me/purchases",
  auth(UserRole.ADMIN, UserRole.USER),
  UserController.getMyPurchases
);

router.get("/:id", UserController.getUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export const UserRoutes = router;
