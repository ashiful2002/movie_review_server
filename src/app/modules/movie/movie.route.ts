import express from "express";
import auth from "../../middlewares/auth";
import { MovieController } from "./movie.controller";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

// public routes
router.get("/", MovieController.getMovies);
router.get("/:id", MovieController.getSingleMovie);
// admin routes
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  MovieController.createMovie
);
router.patch("/:id", auth(UserRole.ADMIN), MovieController.updateMovie);
router.delete("/:id", auth(UserRole.ADMIN), MovieController.deleteMovie);

router.get("/:movieId/reviews", MovieController.getReviews);

export const MoviesRoutes = router;
