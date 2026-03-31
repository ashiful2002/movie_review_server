import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

// current user routes
router.get("/me/access/:movieId", UserController.checkAccess);
router.get("/me/watchlist", UserController.getMyWatchlist);
router.post("/watchlist", UserController.addToWatchlist);
router.delete("/watchlist/:movieId", UserController.removeFromWatchlist);

// purchases
router.get("/me/purchases", UserController.getMyPurchases);

// generic user routes
router.get("/:id", UserController.getUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export const UserRoutes = router;