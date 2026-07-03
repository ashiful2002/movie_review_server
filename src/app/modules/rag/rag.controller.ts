import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { RAGService } from "./rag.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { success } from "zod";

const ragService = new RAGService();

const ingestMovies = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.ingestMoviesData();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "movie data index successfully",
    data: result,
  });
});

// const queryMovies = catchAsync(async (req: Request, res: Response) => {
//   const { query } = req.body;

//   if (!query) {
//     return sendResponse(res, {
//       success: false,
//       httpStatusCode: status.BAD_REQUEST,
//       message: "Query parameter is required",
//     });
//   }
//   const result = await ragService.generateAnswer();
//   sendResponse(res, {
//     success: true,
//     httpStatusCode: status.OK,
//     message: "Query processed successfully",
//   });
// });

export const RagController = {
  ingestMovies,
};
