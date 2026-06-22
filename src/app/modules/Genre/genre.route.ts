import express from "express";
import { GenreController } from "./genre.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), GenreController.getGenres);
router.get("/:id", auth(UserRole.ADMIN), GenreController.getSingleGenre);
router.post("/", auth(UserRole.ADMIN), GenreController.createGenre);
router.put("/:id", auth(UserRole.ADMIN), GenreController.updateGenre);
router.delete("/:id", auth(UserRole.ADMIN), GenreController.deleteGenre);

export const GenreRoutes = router;
