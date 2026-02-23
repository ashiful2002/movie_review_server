import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), ReviewController.createReview);
router.get("/meal/:mealId", ReviewController.getReviewsByMeal);
router.get("/:id", ReviewController.getSingleReview);
router.patch("/:id", auth(UserRole.CUSTOMER), ReviewController.updateReview);
router.delete("/:id", auth(UserRole.CUSTOMER), ReviewController.deleteReview);

export const ReviewRoutes = router;