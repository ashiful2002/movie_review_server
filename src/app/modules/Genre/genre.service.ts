import { prisma } from "../../lib/prisma";
import { IGenrePayload } from "./genre.interface";



const getAllGenres = async () => {
  return await prisma.genre.findMany();
};

const getGenreById = async (id: string) => {
  return await prisma.genre.findUnique({
    where: { id },
  });
};

const createGenre = async (data: IGenrePayload) => {
  return await prisma.genre.create({
    data,
  });
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
