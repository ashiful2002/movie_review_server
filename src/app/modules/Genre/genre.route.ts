import express from "express";
import { GenreController } from "./genre.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get("/", GenreController.getGenres);
router.get("/:id", GenreController.getSingleGenre);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  GenreController.createGenre
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  GenreController.updateGenre
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  GenreController.deleteGenre
);

export const GenreRoutes = router;
