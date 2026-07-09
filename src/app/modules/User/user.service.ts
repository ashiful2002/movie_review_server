import { prisma } from "../../lib/prisma";

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phone: true,
      address: true,
      street: true,
      city: true,
      postalCode: true,
      role: true,
      isPremium: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return user;
};
const updateProfile = async (userId: string, payload: Record<string, any>) => {
  const allowedFields = [
    "name",
    "phone",
    "avatar",
    "street",
    "city",
    "postalCode",
    "address",
  ];

  const data: Record<string, any> = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = payload[field];
    }
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phone: true,
      address: true,
      street: true,
      city: true,
      postalCode: true,
      role: true,
      isPremium: true,
      emailVerified: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
    },
  });

  return null;
};

const getMyWatchlist = async (userId: string) => {
  console.log("Service: getMyWatchlist", userId);

  return [
    { movieId: "1", title: "Batman Begins" },
    { movieId: "2", title: "Inception" },
  ];
};

const addToWatchlist = async (userId: string, movieId: string) => {
  console.log("Service: addToWatchlist", userId, movieId);

  return { userId, movieId };
};

const removeFromWatchlist = async (userId: string, movieId: string) => {
  console.log("Service: removeFromWatchlist", userId, movieId);

  return { userId, movieId };
};

const checkAccess = async (userId: string, movieId: string) => {
  console.log("Service: checkAccess", userId, movieId);

  return {
    hasAccess: true,
    type: "purchase",
  };
};

const getMyPurchases = async (userId: string) => {
  console.log("Service: getMyPurchases", userId);

  return [
    { movieId: "1", type: "purchase", status: "paid" },
    { movieId: "2", type: "rent", status: "active" },
  ];
};

export const UserService = {
  getMe,
  updateProfile,
  deleteUser,

  getMyWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkAccess,
  getMyPurchases,
};
