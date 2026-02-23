import { prisma } from "../../lib/prisma";

export type CreateReviewDTO = {
  mealId: string;
  rating: number;
  comment?: string;
  customerId: string;
};

export type UpdateReviewDTO = {
  rating?: number;
  comment?: string;
};

const createReview = async (payload: CreateReviewDTO) => {
  const { mealId, customerId, rating, comment } = payload;

  const meal = await prisma.meal.findUnique({ where: { id: mealId } });
  if (!meal) throw new Error("Meal not found");

  const existing = await prisma.review.findFirst({
    where: { mealId, customerId },
  });
  if (existing) throw new Error("You have already reviewed this meal");

  const review = await prisma.review.create({
    data: { mealId, customerId, rating, comment },
  });

  // 4️⃣ Update meal metadata (averageRating, totalReviews)
  const reviews = await prisma.review.findMany({ where: { mealId } });
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  await prisma.meal.update({
    where: { id: mealId },
    data: { averageRating, totalReviews },
  });

  return review;
};

const getReviewsByMeal = async (mealId: string) => {
  return await prisma.review.findMany({
    where: { mealId },
    include: { customer: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getSingleReview = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: { customer: { select: { id: true, name: true, avatar: true } } },
  });
  if (!review) throw new Error("Review not found");
  return review;
};

const updateReview = async (id: string, customerId: string, payload: UpdateReviewDTO) => {
  // Ensure the review belongs to the customer
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.customerId !== customerId) throw new Error("Unauthorized");

  return await prisma.review.update({
    where: { id },
    data: payload,
  });
};

const deleteReview = async (id: string, customerId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.customerId !== customerId) throw new Error("Unauthorized");

  // Delete review
  await prisma.review.delete({ where: { id } });

  // Recalculate meal metadata
  const mealId = review.mealId;
  const reviews = await prisma.review.findMany({ where: { mealId } });
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  await prisma.meal.update({
    where: { id: mealId },
    data: { totalReviews, averageRating },
  });
};

export const ReviewService = {
  createReview,
  getReviewsByMeal,
  getSingleReview,
  updateReview,
  deleteReview,
};