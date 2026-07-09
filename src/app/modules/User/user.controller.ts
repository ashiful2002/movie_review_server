import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.service";
import { catchAsync } from "../../shared/catchAsync";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMe(req.user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateProfile(req.user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteUser(req.user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Account deleted successfully",
    data: null,
  });
});

// WATCHLIST
const getMyWatchlist: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.getMyWatchlist(req.user?.id);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Watchlist fetched",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const addToWatchlist: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.addToWatchlist(
      req.user?.id,
      req.body.movieId
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Added to watchlist",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const removeFromWatchlist: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.removeFromWatchlist(
      req.user?.id,
      req.params.movieId as string
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Removed from watchlist",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ACCESS
const checkAccess: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.checkAccess(
      req.user?.id,
      req.params.movieId as string
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Access checked",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// PURCHASES
const getMyPurchases: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.getMyPurchases(req.user?.id);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Purchases fetched",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserController = {
  getMe,
  updateProfile,
  deleteUser,

  getMyWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkAccess,
  getMyPurchases,
};
