import { Movie, Prisma } from "../../../generated/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getMovies = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Movie,
    Prisma.MovieWhereInput,
    Prisma.MovieInclude
  >(prisma.movie, query);

  const result = await queryBuilder
    .include({ genres: true, reviews: true })
    .paginate()
    .sort()
    .fields()
    .execute();
  return result;
};

const getSingleMovie = async (id: string) => {
  const singleMovie = await prisma.movie.findUnique({
    where: {
      id,
    },
    include: {
      reviews: {
        include: {
          user: true,
        },
      },
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  return singleMovie;
};

const getReviews = async (movieId: string) => {
  const review = await prisma.movie.findMany({
    where: {
      id: movieId,
    },
  });
  return review;
};

const createMovie = async (payload: any) => {
  const { genreIds = [], ...movieData } = payload;

  try {
    const existingGenres = await prisma.genre.findMany({
      where: { id: { in: genreIds } },
    });

    if (existingGenres.length !== genreIds.length) {
      throw new Error("One or more genres do not exist");
    }

    const movie = await prisma.movie.create({
      data: {
        ...movieData,
        genres: {
          create: genreIds.map((genreId: string) => ({
            genre: {
              connect: { id: genreId },
            },
          })),
        },
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return movie;
  } catch (error) {
    console.error("Movie creation error:", error);
    throw error;
  }
};

const updateMovie = async (id: string, payload: any) => {
  const existing = await prisma.movie.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Movie not found");
  }

  return await prisma.movie.update({
    where: { id },
    data: payload,
  });
};

const deleteMovie = async (id: string) => {
  const existingMovie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!existingMovie) {
    throw new Error("Movie not found");
  }

  return await prisma.movie.delete({
    where: { id },
  });
};

export const MovieService = {
  getMovies,
  getSingleMovie,
  getReviews,
  createMovie,
  updateMovie,
  deleteMovie,
};
