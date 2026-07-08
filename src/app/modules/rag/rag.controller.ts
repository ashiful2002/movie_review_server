import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { RAGService } from "./rag.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { redisService } from "../../lib/radis";
 import { buildCacheKey, withCache } from "../../lib/withCache";

const ragService = new RAGService();

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.getStats();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Rag status get successfully",
    data: result,
  });
});

const ingestMovies = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.ingestMoviesData();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "movie data index successfully",
    data: result,
  });
});

const queryRag = catchAsync(async (req: Request, res: Response) => {
  const { query, limit, sourceType } = req.body;
  if (!query) {
    return sendResponse(res, {
      success: false,
      httpStatusCode: status.BAD_REQUEST,
      message: "Query parameter is required",
    });
  }

  const cacheKey = buildCacheKey("rag:query", query, limit ?? 5, sourceType || "all");
  const { data, fromCache } = await withCache(cacheKey, 600, () =>
    ragService.generateAnswer(query, limit, sourceType, true)
  );

  return sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: fromCache ? "data retrieved from cache" : "Query processed successfully",
    data,
  });
});

export const RagController = { getStats, ingestMovies, queryRag };
