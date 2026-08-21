import status from "http-status";
import { Genre, Prisma } from "../../../generated/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IGenrePayload } from "./genre.interface";
import AppError from "../../errorHelpers/AppError";
import slugify from "slugify";

export async function generateUniqueGenreSlug(name: string) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await prisma.genre.findUnique({
      where: { slug },
    });

    if (!exists) return slug;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

// const getAllGenres = async (query: IQueryParams) => {
//   const queryBuilder = new QueryBuilder<
//     Genre,
//     Prisma.GenreWhereInput,
//     Prisma.GenreInclude
//   >(prisma.genre, query);

//   const result = await queryBuilder
//     .search()
//     .where({
//       isDeleted: false,
//     })
//     .include({
//       movies: true,
//     })
//     .paginate()
//     .sort()
//     .fields()
//     .execute();

//   return result;
// };

const getAllGenres = async (params: any) => {
  const result = await prisma.genre.findMany({
    where: { isDeleted: false },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      movies: true,
      _count: {
        select: {
          movies: true,
        },
      },
    },
  });

  return result;
};
const getGenreById = async (id: string) => {
  return await prisma.genre.findUnique({
    where: { id, isDeleted: false },
    include: {
      movies: true,
      _count: {
        select: {
          movies: true,
        },
      },
    },
  });
};

const createGenre = async (data: any) => {
  const slug = await generateUniqueGenreSlug(data.name);

  const existingGenre = await prisma.genre.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingGenre) {
    throw new AppError(status.CONFLICT, "Genre already exists");
  }

  const genre = await prisma.genre.create({
    data: {
      ...data,
      slug,
    },
  });

  return genre;
};

const updateGenre = async (id: string, data: Partial<IGenrePayload>) => {
  try {
    return await prisma.genre.update({
      where: { id },
      data,
    });
  } catch {
    return null;
  }
};

const deleteGenre = async (id: string) => {
  try {
    await prisma.genre.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    return true;
  } catch {
    return false;
  }
};

export const GenreService = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
