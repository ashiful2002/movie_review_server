import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: 400,
      success: false,
      message: "User ID is required",
    });
  }
  const result = await ReviewService.createReview(userId, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getSingleReview(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Review fetched",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReview(
    req.params.id as string,
    req.user?.id,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Review updated",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.deleteReview(
    req.params.id as string,
    req.user?.id
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Review deleted",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
};
