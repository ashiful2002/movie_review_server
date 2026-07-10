import { Movie, Prisma } from "../../../generated/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import slugify from "slugify";

export async function generateUniqueSlug(title: string) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await prisma.movie.findUnique({
      where: { slug },
    });

    if (!exists) return slug;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

const getMovies = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Movie,
    Prisma.MovieWhereInput,
    Prisma.MovieInclude
  >(prisma.movie, query, {
    searchableFields: ["title", "director"],
    filterableFields: ["genres.genreId", "isPremium", "rating"],
  });

  const result = await queryBuilder
    .include({
      reviews: { orderBy: { createdAt: "asc" } },
      genres: {
        include: {
          genre: true,
        },
      },
    })
    .where({ isDeleted: false })
    .search()
    .filter()
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getSingleMovie = async (slug: string) => {
  const movie = await prisma.movie.findFirst({
    where: {
      slug,
      isDeleted: false,
    },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }
  const singleMovie = await prisma.movie.update({
    where: {
      slug,
      isDeleted: false,
    },
    data: {
      views: { increment: 1 },
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

const createMovie = async (payload: any) => {
  const { genreIds = [], ...movieData } = payload;

  try {
    const existingGenres = await prisma.genre.findMany({
      where: { id: { in: genreIds } },
    });

    if (existingGenres.length !== genreIds.length) {
      throw new Error("One or more genres do not exist");
    }
    const slug = await generateUniqueSlug(payload.title);

    const movie = await prisma.movie.create({
      data: {
        ...movieData,
        slug,
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

const updateMovie = async (slug: string, payload: any) => {
  const existing = await prisma.movie.findUnique({
    where: { slug },
  });

  if (!existing) {
    throw new Error("Movie not found");
  }

  return await prisma.movie.update({
    where: { slug },
    data: payload,
  });
};

const deleteMovie = async (slug: string) => {
  const existingMovie = await prisma.movie.findUnique({
    where: { slug },
  });

  if (!existingMovie) {
    throw new Error("Movie not found");
  }

  return await prisma.movie.update({
    where: { slug },
    data: {
      isDeleted: false,
    },
  });
};

export const MovieService = {
  getMovies,
  getSingleMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
