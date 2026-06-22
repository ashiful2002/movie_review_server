import { prisma } from "../../lib/prisma";

const getAllGenres = async () => {
  return await prisma.genre.findMany();
};

const getGenreById = async (id: string) => {
  return await prisma.genre.findUnique({
    where: { id },
    // include: {
    //   movies: {
    //     include: {
    //       movie: true,
    //     },
    //   },
    // },
  });
};

const createGenre = async (data: { name: string }) => {
  return await prisma.genre.create({
    data,
  });
};

const updateGenre = async (id: string, data: Partial<{ name: string }>) => {
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
