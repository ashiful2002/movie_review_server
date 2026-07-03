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
    case UserRole.SUPER_ADMIN:
      statsData = getSuperAdminStatsData();
      break;
    default:
      throw new AppError(status.BAD_REQUEST, "Invalid user role");
  }

  return statsData;
};

const getAdminStatsData = async () => {
  const [
    totalUsers,
    totalMovies,
    totalReviews,
    totalGenres,
    totalSubscriptions,
    totalSubscriptionPlans,
    moviesByGenre,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.movie.count(),
    prisma.review.count(),
    prisma.genre.count(),
    prisma.subscription.count(),
    prisma.subscriptionPlan.count(),
    prisma.genre.findMany({
      select: {
        name: true,
        _count: {
          select: {
            movies: true,
          },
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalMovies,
    totalReviews,
    totalGenres,
    totalSubscriptions,
    totalSubscriptionPlans,
    moviesByGenre: moviesByGenre.map((genre) => ({
      name: genre.name,
      value: genre._count.movies,
    })),
  };
};

const getUserStatusData = async () => {};

const getSuperAdminStatsData = async () => {
  const [
    totalUsers,
    totalAdmin,
    totalMovies,
    totalReviews,
    totalGenres,
    totalSubscriptions,
    totalSubscriptionPlans,
    moviesByGenre,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.admin.count(),
    prisma.movie.count(),
    prisma.review.count(),
    prisma.genre.count(),
    prisma.subscription.count(),
    prisma.subscriptionPlan.count(),
    prisma.genre.findMany({
      select: {
        name: true,
        _count: {
          select: {
            movies: true,
          },
        },
      },
    }),
  ]);

  const topReviewedMovies = await prisma.movie.findMany({
    take: 5,
    orderBy: {
      reviews: {
        _count: "desc",
      },
    },
    select: {
      title: true,
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  const topMoviesChartData = topReviewedMovies.map((movie) => ({
    name:
      movie.title.length > 18 ? movie.title.slice(0, 18) + "..." : movie.title,
    reviews: movie._count.reviews,
  }));
  return {
    totalUsers,
    totalAdmin,
    totalMovies,
    totalReviews,
    totalGenres,
    totalSubscriptions,
    totalSubscriptionPlans,
    topReviewedMovies: topMoviesChartData,

    moviesByGenre: moviesByGenre.map((genre) => ({
      name: genre.name,
      value: genre._count.movies,
    })),
  };
};

export const StatsService = {
  getDashboardStatsData,
};
