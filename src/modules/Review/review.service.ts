import { prisma } from "../../lib/prisma";
import { ReviewStatus } from "@prisma/client";

//////////////////////////////////////////////////////
// CREATE REVIEW
//////////////////////////////////////////////////////

const createReview = async (userId: string, payload: any) => {
  const { movieId, rating, content, tags, spoiler } = payload;

  if (!movieId) throw new Error("Movie ID is required");
  if (rating < 0 || rating > 10) {
    throw new Error("Rating must be between 0 and 5");
  }

  return await prisma.review.create({
    data: {
      rating,
      content,
      tags,
      spoiler,
      user: { connect: { id: userId } },
      movie: { connect: { id: movieId } },
    },
    include: {
      user: true,
      movie: true,
    },
  });
};

//////////////////////////////////////////////////////
// GET SINGLE REVIEW
//////////////////////////////////////////////////////

const getSingleReview = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: true,
      movie: true,
      comments: true,
      likes: true,
    },
  });

  if (!review) throw new Error("Review not found");

  return review;
};

//////////////////////////////////////////////////////
// UPDATE REVIEW
//////////////////////////////////////////////////////

const updateReview = async (id: string, userId: string, payload: any) => {
  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) throw new Error("Review not found");
  if (existingReview.userId !== userId) {
    throw new Error("Unauthorized");
  }

  if (payload.rating !== undefined) {
    if (payload.rating < 0 || payload.rating > 5) {
      throw new Error("Rating must be between 0 and 5");
    }
  }

  return await prisma.review.update({
    where: { id },
    data: {
      ...payload,
      isEdited: true,
    },
  });
};

//////////////////////////////////////////////////////
// DELETE REVIEW
//////////////////////////////////////////////////////

const deleteReview = async (id: string, userId: string) => {
  const existing = await prisma.review.findUnique({
    where: { id },
  });

  if (!existing) throw new Error("Review not found");
  if (existing.userId !== userId) throw new Error("Unauthorized");

  await prisma.review.delete({
    where: { id },
  });

  return { message: "Review deleted successfully" };
};

//////////////////////////////////////////////////////
// ADMIN: MODERATION
//////////////////////////////////////////////////////

const getPendingReviews = async () => {
  return await prisma.review.findMany({
    where: { status: ReviewStatus.PENDING },
    include: {
      user: true,
      movie: true,
    },
  });
};

const approveReview = async (id: string) => {
  return await prisma.review.update({
    where: { id },
    data: { status: ReviewStatus.APPROVED },
  });
};

const rejectReview = async (id: string) => {
  return await prisma.review.update({
    where: { id },
    data: { status: ReviewStatus.REJECTED },
  });
};

//////////////////////////////////////////////////////
// LIKE SYSTEM (TOGGLE)
//////////////////////////////////////////////////////

const likeReview = async (reviewId: string, userId: string) => {
  const existing = await prisma.like.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });

  if (existing) {
    throw new Error("Already liked");
  }

  return await prisma.like.create({
    data: {
      userId,
      reviewId,
    },
  });
};

const unlikeReview = async (reviewId: string, userId: string) => {
  const existing = await prisma.like.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });

  if (!existing) {
    throw new Error("Like not found");
  }

  await prisma.like.delete({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });

  return { message: "Unliked successfully" };
};

//////////////////////////////////////////////////////
// EXPORT
//////////////////////////////////////////////////////

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