import express from "express";
import { RagController } from "./rag.controller";

const router = express.Router();

router.get("/stats", RagController.getStats);
router.post("/ingest-movies", RagController.ingestMovies);

router.post("/query", RagController.queryRag);
export const RagRoutes = router;
