import status from "http-status";
import { Favourite, Prisma } from "../../../generated/prisma";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { prisma } from "../../lib/prisma";

const getFavourite = async () => {
  const result = await prisma.favourite.findMany({
    include: {
      movie: true,
    },
  });

  return result;
};

const addToFavourite = async (userId: string, movieId: string) => {
  const existing = await prisma.favourite.findUnique({
    where: { userId_movieId: { userId, movieId } },
  });

  if (existing) {
    throw new AppError(status.CONFLICT, "Movie already in favourite");
  }
  const result = await prisma.favourite.create({
    data: {
      userId,
      movieId,
    },
    include: {
      movie: true,
    },
  });

  return result;
};

const removeFromFavourite = async (userId: string, movieId: string) => {
  const deleted = await prisma.favourite.deleteMany({
    where: { userId, movieId },
  });

  if (!deleted.count) {
    throw new AppError(status.NOT_FOUND, "Movie not found in favourite");
  }

  return deleted;
};
export const FavouriteServices = {
  getFavourite,
  addToFavourite,
  removeFromFavourite,
};
