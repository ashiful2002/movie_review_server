import { prisma } from "../../lib/prisma";

const creteLikes = async () => {
  //   const result = await prisma.review.create();
};

const getLikes = async () => {
  const result = await prisma.like.count();
  return result;
};
export const LikesService = {
  creteLikes,
  getLikes,
};
