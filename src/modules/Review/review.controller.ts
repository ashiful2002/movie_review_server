import { NextFunction, RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const result = await ReviewService.createReview(userId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleReview: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewService.getSingleReview(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review fetched",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateReview: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewService.updateReview(
      req.params.id as string,
      req.user?.id,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review updated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview: RequestHandler = async (req, res, next) => {
  try {
    await ReviewService.deleteReview(req.params.id as string, req.user?.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN
const getPendingReviews: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewService.getPendingReviews();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Pending reviews",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const approveReview: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewService.approveReview(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review approved",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const rejectReview: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewService.rejectReview(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review rejected",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// LIKES
const likeReview: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewService.likeReview(
      req.params.id as string,
      req.user?.id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review liked",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const unlikeReview: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewService.unlikeReview(
      req.params.id as string,
      req.user?.id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Like removed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getPendingReviews,
  approveReview,
  rejectReview,
  likeReview,
  unlikeReview,
};
