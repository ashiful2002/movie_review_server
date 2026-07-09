import express from "express";
import { WatchlistController } from "./watchlist.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post("/", auth(UserRole.USER), WatchlistController.addToWatchlist);
router.get("/", auth(UserRole.USER), WatchlistController.getWatchlist);
router.delete(
  "/:movieId",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  WatchlistController.removeFromWatchlist
);

export const WatchlistRoutes = router;
