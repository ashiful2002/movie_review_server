import { prisma } from "../../lib/prisma";

const createReview = async (userId: string, payload: any) => {
  const { movieId, rating, content, tags, spoiler } = payload;

  if (!movieId) throw new Error("Movie ID is required");
  if (!content?.trim()) throw new Error("Review content is required");
  if (rating < 0 || rating > 10) {
    throw new Error("Rating must be between 0 and 10");
  }


  const [movieExists, userExists] = await Promise.all([
    prisma.movie.findUnique({ where: { id: movieId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  if (!movieExists) throw new Error("Movie not found");
  if (!userExists) throw new Error("User not found");


  const result = await prisma.review.create({
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

  return result;
};

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

export const ReviewService = {
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
};
