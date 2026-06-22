import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { MovieController } from "./movie.controller";

const router = express.Router();

// public routes
router.get("/", MovieController.getMovies);
router.get("/:id", MovieController.getSingleMovie);
router.get("/:movieId/reviews", MovieController.getReviews);

// admin routes
router.post("/", auth(UserRole.ADMIN), MovieController.createMovie);
router.patch("/:id", auth(UserRole.ADMIN), MovieController.updateMovie);
router.delete("/:id", auth(UserRole.ADMIN), MovieController.deleteMovie);

// user actions
router.post(
  "/:id/purchase",
  auth(UserRole.USER),
  MovieController.purchaseMovie
);
router.post("/:id/rent", auth(UserRole.USER), MovieController.rentMovie);

export const MoviesRoutes = router;

