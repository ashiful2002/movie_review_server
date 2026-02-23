import { includes } from "zod";
import { prisma } from "../../lib/prisma";

const createMeal = async (payload: any, userId: string) => {
 
  // console.log(payload);
  
  const provider = await prisma.providerProfile.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!provider) {
    throw new Error("Provider profile not found");
  }
  const result = await prisma.meal.create({
    data: { ...payload, providerId: provider.id },
  });
  return result;
};
// get all meals
const getMeals = async (
  userId: string,
  filters: {
    name?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
  }
) => {
  const {
    name,
    categoryId,
    minPrice,
    maxPrice,
    page = "1",
    limit = "10",
  } = filters;
  // ✅ Convert to numbers
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {
    provider: { userId },
  };

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  // ✅ Transaction for total + paginated data
  const [total, data] = await prisma.$transaction([
    prisma.meal.count({ where }),
    prisma.meal.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      include: {
        reviews: true,
      },
    }),
  ]);

  // return data;
  return {
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPage: Math.ceil(total / limitNumber),
    },
    data,
  };
};

// get single meal
const getSingleMeal = async (mealId: string) => {
  const result = await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
    include: {
      provider: true,
    },
  });
  console.log({ mealId, result });

  return result;
};
export const MealService = {
  createMeal,
  getMeals,
  getSingleMeal,
};
