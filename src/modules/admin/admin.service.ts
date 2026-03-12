import { User, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};
const getSingleUser = async (id: string) => {
  const users = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return users;
};
const getAllOrders = async () => {
  const result = await prisma.order.findMany();
  return result;
};

const makeProvider = async (userId: string, role: UserRole) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (role === "PROVIDER") {
    throw new Error("User is already a provider");
  }

  if (role === "ADMIN") {
    throw new Error("Admin cannot be converted to provider");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        role: "PROVIDER",
      },
    });

    await tx.providerProfile.create({
      data: {
        userId: userId,
        restaurantName: `${user.name}'s Restaurant`,
      },
    });

    return updatedUser;
  });

  return result;
};
export const AdminService = {
  getAllUsers,
  getSingleUser,
  getAllOrders,
  makeProvider,
};
