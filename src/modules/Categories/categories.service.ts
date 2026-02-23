import { prisma } from "../../lib/prisma";

const createCategory = async (payload: { name: string }) => {
  const baseSlug = payload.name.toLowerCase().trim().replace(/\s+/g, "-");

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return await prisma.category.create({
    data: {
      name: payload.name,
      slug,
    },
  });
};

const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "desc",
    },
  });
};

const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const updateCategory = async (id: string, payload: { name?: string }) => {
  return await prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
