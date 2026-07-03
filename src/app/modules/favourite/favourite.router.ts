import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { FavouriteController } from "./favourite.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  FavouriteController.addToFavourite
);
router.get(
  "/",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  FavouriteController.getFavourite
);
router.delete(
  "/:movieId",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  FavouriteController.removeFromFavourite
);

export const FavouriteRoutes = router;
