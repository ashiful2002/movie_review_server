import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { WatchlistService } from "./watchlist.service";

const addToWatchlist: RequestHandler = async (req, res, next) => {
  try {
    const result = await WatchlistService.addToWatchlist(
      req.user?.id,
      req.body.movieId
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Added to watchlist",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getWatchlist: RequestHandler = async (req, res, next) => {
  try {
    const result = await WatchlistService.getWatchlist(req.user?.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Watchlist fetched",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const removeFromWatchlist: RequestHandler = async (req, res, next) => {
  try {
    const result = await WatchlistService.removeFromWatchlist(
      req.user?.id,
      req.params.movieId as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Removed from watchlist",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const WatchlistController = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
};
