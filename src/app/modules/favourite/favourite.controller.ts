import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";
import { IQueryParams } from "../../interfaces/query.interface";
import status from "http-status";
import { FavouriteServices } from "./favourite.service";

const getFavourite = catchAsync(async (req: Request, res: Response) => {
  const result = await FavouriteServices.getFavourite();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Get favourite movies successfully",
    data: result,
    // meta: result.meta,
  });
});

const addToFavourite = catchAsync(async (req: Request, res: Response) => {
  const result = await FavouriteServices.addToFavourite(
    req.user?.id,
    req.body.movieId
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Movie added to favourite successfully",
    data: result,
  });
});

const removeFromFavourite = catchAsync(async (req: Request, res: Response) => {
  const result = await FavouriteServices.removeFromFavourite(
    req.user?.id,
    req.params.movieId as string
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Removed from favourite",
    data: result,
  });
});
export const FavouriteController = {
  getFavourite,
  addToFavourite,
  removeFromFavourite,
};
