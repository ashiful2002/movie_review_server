import express from "express";
import { aimovieSearchController } from "./search_movie.controller";

const router = express.Router()

router.post("/search-movies", aimovieSearchController.AiMovieSearch)

export const AiMovieSearchRoutes = router