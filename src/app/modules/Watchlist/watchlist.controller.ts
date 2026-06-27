import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { WatchlistService } from "./watchlist.service";
import { catchAsync } from "../../shared/catchAsync";
import { IQueryParams } from "../../interfaces/query.interface";
import status from "http-status";

const getWatchlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WatchlistService.getWatchlist(req.query as IQueryParams);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Watchlist retrived successfully",
    data: result,
  });
});

const addToWatchlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WatchlistService.addToWatchlist(
    req.user?.id,
    req.body.movieId
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Movie added to watchlist successfully",
    data: result,
  });
});

const removeFromWatchlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WatchlistService.removeFromWatchlist(
    req.user?.id,
    req.params.movieId as string
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Removed from watchlist",
    data: result,
  });
});
export const WatchlistController = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
};
