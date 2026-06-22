import express from "express";
import { WatchlistController } from "./watchlist.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.USER), WatchlistController.addToWatchlist);
router.get("/", auth(UserRole.USER), WatchlistController.getWatchlist);
router.delete(
  "/:movieId",
  auth(UserRole.USER),
  WatchlistController.removeFromWatchlist
);

export const WatchlistRoutes = router;
