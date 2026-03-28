import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.getUser(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User fetched",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.updateUser(
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User updated",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// WATCHLIST
const getMyWatchlist: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.getMyWatchlist(req.user?.id);

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

const addToWatchlist: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserService.addToWatchlist(
      req.user?.id,
      req.body.movieId
    );

    sendResponse(res, {
      statusCode: 200,
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
      statusCode: 200,
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
      statusCode: 200,
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
      statusCode: 200,
      success: true,
      message: "Purchases fetched",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserController = {
  getUser,
  updateUser,
  deleteUser,
  getMyWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkAccess,
  getMyPurchases,
};
