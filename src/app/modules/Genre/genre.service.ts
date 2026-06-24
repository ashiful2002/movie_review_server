import { Genre, Prisma } from "../../../generated/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IGenrePayload } from "./genre.interface";

const getAllGenres = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Genre,
    Prisma.GenreWhereInput,
    Prisma.GenreInclude
  >(prisma.genre, query);

  const result = await queryBuilder
    .where({
      isDeleted: false,
    })
    .include({
      movies: true,
    })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getGenreById = async (id: string) => {
  return await prisma.genre.findUnique({
    where: { id },
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

const createGenre = async (data: IGenrePayload) => {
  const genre = await prisma.genre.create({
    data,
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
    await prisma.genre.delete({
      where: { id },
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
