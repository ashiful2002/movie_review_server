import { Movie, Review } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (userId: string, payload: Review) => {
  const { movieId, rating, content, tags, spoiler } = payload;

  const review = await prisma.review.create({
    data: {
      rating,
      content,
      tags,
      spoiler,
      user: { connect: { id: userId } },
      movie: { connect: { id: movieId } },
    },
  });

  return review;
};

const getSingleReview = async (id: string) => {
  console.log("Service: getSingleReview", id);

  const review = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  return review;
};

const updateReview = async (id: string, userId: string, payload: any) => {
  const { rating, content, tags, spoiler } = payload;

  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  if (existingReview.userId !== userId) {
    throw new Error("You are not authorized to update this review");
  }
  if (rating !== undefined && (rating < 0 || rating > 5)) {
    throw new Error("Rating must be between 0 and 5");
  }

  const updateData: any = {};

  if (rating !== undefined) updateData.rating = rating;
  if (content !== undefined) updateData.content = content;
  if (tags !== undefined) updateData.tags = tags;
  if (spoiler !== undefined) updateData.spoiler = spoiler;

  updateData.isEdited = true;

  const result = await prisma.review.updateMany({
    where: {
      id,
      userId,
    },
    data: updateData,
  });

  if (result.count === 0) {
    throw new Error("Update failed or unauthorized");
  }

  return result;
};

const deleteReview = async (id: string, userId: string) => {
  const result = await prisma.review.deleteMany({
    where: { id, userId },
  });

  if (!result.count) {
    throw new Error("Review not found or unauthorized");
  }

};

// ADMIN
const getPendingReviews = async () => {
  console.log("Service: getPendingReviews");

  return [
    { id: "rev_1", comment: "Pending review 1" },
    { id: "rev_2", comment: "Pending review 2" },
  ];
};

const approveReview = async (id: string) => {
  console.log("Service: approveReview", id);

  return { id, status: "approved" };
};

const rejectReview = async (id: string) => {
  console.log("Service: rejectReview", id);

  return { id, status: "rejected" };
};

// LIKES
const likeReview = async (reviewId: string, userId: string) => {
  console.log("Service: likeReview", reviewId, userId);

  return {
    reviewId,
    userId,
    liked: true,
  };
};

const unlikeReview = async (reviewId: string, userId: string) => {
  console.log("Service: unlikeReview", reviewId, userId);

  return {
    reviewId,
    userId,
    liked: false,
  };
};

export const ReviewService = {
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
