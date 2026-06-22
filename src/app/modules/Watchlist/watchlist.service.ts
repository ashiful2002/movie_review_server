import { prisma } from "../../lib/prisma";

const getWatchlist = async (userId: string) => {
  const watchlist = await prisma.watchlist.findMany({
    where: { userId },
    include: {
      movie: true,
    },
  });

  return watchlist;
};

const addToWatchlist = async (userId: string, movieId: string) => {
  const existing = await prisma.watchlist.findUnique({
    where: { userId_movieId: { userId, movieId } },
  });
  if (existing) {
    return { message: "Movie already in watchlist" };
  }

  const added = await prisma.watchlist.create({
    data: {
      userId,
      movieId,
    },
    include: {
      movie: true,
    },
  });

  return added;
};

const removeFromWatchlist = async (userId: string, movieId: string) => {
  const deleted = await prisma.watchlist.deleteMany({
    where: { userId, movieId },
  });

  if (!deleted.count) {
    throw new Error("Movie not found in watchlist");
  }
};

export const WatchlistService = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
