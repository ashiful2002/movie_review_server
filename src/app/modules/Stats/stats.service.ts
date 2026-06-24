import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../../generated/prisma";

const getDashboardStatsData = async (user: IRequestUser) => {
  let statsData;

  switch (user.role) {
    case UserRole.ADMIN:
      statsData = getAdminStatsData();
      break;
    case UserRole.USER:
      statsData = getUserStatusData();
      break;

    default:
      throw new AppError(status.BAD_REQUEST, "Invalid user role");
  }

  return statsData;
};

const getAdminStatsData = async () => {
  const totalUsers = await prisma.user.count();
  const totalMovies = await prisma.movie.count();
  const totalReviews = await prisma.review.count();
  const totalGenres = await prisma.genre.count();
  const totalSubscriptions = await prisma.subscription.count();
  const totalSubscriptionPlans = await prisma.subscriptionPlan.count();

  return {
    totalUsers,
    totalMovies,
    totalReviews,
    totalGenres,
    totalSubscriptions,
    totalSubscriptionPlans,
  };
};

const getUserStatusData = () => {};

export const StatsService = {
  getDashboardStatsData,
};
