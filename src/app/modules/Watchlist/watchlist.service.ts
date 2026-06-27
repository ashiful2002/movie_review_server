import status from "http-status";
import { Prisma, Watchlist } from "../../../generated/prisma";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getWatchlist = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Watchlist,
    Prisma.WatchlistWhereInput,
    Prisma.WatchlistInclude
  >(prisma.watchlist, query);

  const result = await queryBuilder
    .include({ movie: true, user: true })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const addToWatchlist = async (userId: string, movieId: string) => {
  const existing = await prisma.watchlist.findUnique({
    where: { userId_movieId: { userId, movieId } },
  });

  if (existing) {
    throw new AppError(status.CONFLICT, "Movie already in watchlist");
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
    throw new AppError(status.NOT_FOUND, "Movie not found in watchlist");
  }

  return deleted;
};
export const WatchlistService = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
