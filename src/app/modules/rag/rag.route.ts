import express from "express";
import { RagController } from "./rag.controller";

const router = express.Router();

router.post("/ingest-movies", RagController.ingestMovies);

router.get("/query");
export const RagRoutes = router;
