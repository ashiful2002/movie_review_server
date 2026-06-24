import express from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get("/:id", ReviewController.getSingleReview);
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ReviewController.createReview
);
router.patch(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ReviewController.updateReview
);
router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  ReviewController.deleteReview
);

export const ReviewsRoutes = router;
