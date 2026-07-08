import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../../generated/prisma";

const getDashboardStatsData = async (user: IRequestUser) => {
  let statsData;
  let userId = user.id;
  switch (user.role) {
    case UserRole.ADMIN:
      statsData = getAdminStatsData();
      break;
    case UserRole.USER:
      statsData = getUserStatsData(userId);
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

const getUserStatsData = async (userId: string) => {
  if (!userId) {
    throw new AppError(status.BAD_REQUEST, "User ID is required");
  }
  const [
    totalReviews,
    totalWatchlist,
    totalFavourites,
    totalComments,
    totalFollowers,
    totalFollowing,
    likesReceived,
    user,
    reviewsByGenre,
  ] = await Promise.all([
    prisma.review.count({ where: { userId } }),
    prisma.watchlist.count({ where: { userId } }),
    prisma.favourite.count({ where: { userId } }),
    prisma.comment.count({ where: { userId } }),
    prisma.follow.count({ where: { followingId: userId } }), // people following me
    prisma.follow.count({ where: { followerId: userId } }), // people I follow
    prisma.like.count({ where: { review: { userId } } }), // likes on my reviews
    prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true, currentSubscriptionId: true },
    }),
    prisma.review.findMany({
      where: { userId },
      select: {
        movie: {
          select: {
            genres: {
              select: { genre: { select: { name: true } } },
            },
          },
        },
      },
    }),
  ]);

  // aggregate genre counts from the user's reviewed movies
  const genreCountMap: Record<string, number> = {};
  reviewsByGenre.forEach((review) => {
    review.movie.genres.forEach((g) => {
      genreCountMap[g.genre.name] = (genreCountMap[g.genre.name] || 0) + 1;
    });
  });
  const moviesByGenre = Object.entries(genreCountMap).map(([name, value]) => ({
    name,
    value,
  }));

  const recentReviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      rating: true,
      createdAt: true,
      movie: { select: { title: true, thumbnail: true } },
    },
  });

  return {
    totalReviews,
    totalWatchlist,
    totalFavourites,
    totalComments,
    totalFollowers,
    totalFollowing,
    likesReceived,
    isPremium: user?.isPremium ?? false,
    hasActiveSubscription: !!user?.currentSubscriptionId,
    moviesByGenre,
    recentReviews,
  };
};

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
