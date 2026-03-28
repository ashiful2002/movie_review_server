import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";

const router = express.Router();

// admin routes (put BEFORE :id)
router.get(
  "/pending",
  auth(UserRole.ADMIN),
  ReviewController.getPendingReviews
);
router.patch(
  "/:id/approve",
  auth(UserRole.ADMIN),
  ReviewController.approveReview
);
router.patch(
  "/:id/reject",
  auth(UserRole.ADMIN),
  ReviewController.rejectReview
);

// create
router.post("/", auth(UserRole.USER), ReviewController.createReview);

// get
router.get("/:id", ReviewController.getSingleReview);

// update & delete
router.patch(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  ReviewController.updateReview
);
router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  ReviewController.deleteReview
);

// likes
router.post("/:id/like", auth(UserRole.USER), ReviewController.likeReview);
router.delete("/:id/like", auth(UserRole.USER), ReviewController.unlikeReview);

export const ReviewsRoutes = router;
