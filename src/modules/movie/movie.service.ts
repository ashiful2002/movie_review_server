import { prisma } from "../../lib/prisma";

const getMovies = async (query: any) => {
  console.log("Service: getMovies", query);

  const { search, genre, year, rating } = query;

  const where: any = {};

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (genre) {
    where.genres = {
      some: {
        genre: {
          name: genre,
        },
      },
    };
  }

  if (year) {
    where.releaseYear = Number(year);
  }

  if (rating) {
    where.reviews = {
      some: {
        rating: {
          gte: Number(rating),
        },
      },
    };
  }
  const data = await prisma.movie.findMany({
    where,
    include: {
      reviews: true,
      genres: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
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
  const { genreIds, ...movieData } = payload;
  console.log(payload);

  try {
    const movie = await prisma.movie.create({
      data: {
        ...movieData,
        genres: genreIds?.length
          ? {
              create: genreIds.map((id: string) => ({
                genreId: id,
              })),
            }
          : undefined,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return { movie };
  } catch (error) {
    console.error("PRISMA ERROR:", error); // 👈 IMPORTANT
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

const purchaseMovie = async (movieId: string, userId: string) => {
  console.log("Service: purchaseMovie", movieId, userId);

  return {
    movieId,
    userId,
    type: "purchase",
  };
};

const rentMovie = async (movieId: string, userId: string) => {
  console.log("Service: rentMovie", movieId, userId);

  return {
    movieId,
    userId,
    type: "rent",
    expiresIn: "48h",
  };
};

export const MovieService = {
  getMovies,
  getSingleMovie,
  getReviews,
  createMovie,
  updateMovie,
  deleteMovie,
  purchaseMovie,
  rentMovie,
};
