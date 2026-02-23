import { prisma } from "../../lib/prisma";

const createProviderProfile = async (payload: any, userId: string) => {
  const existing = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("Profile already exists");
  }

  const result = await prisma.providerProfile.create({
    data: {
      ...payload,
      userId,
    },
  });

  return result;
};

const getMyProviderProfile = async (userId: string) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

const getSingleProviderProfile = async (profileId: string) => {
  const result = await prisma.providerProfile.findUnique({
    where: { id: profileId },
  });

  if (!result) {
    throw new Error("Provider profile not found");
  }

  return result;
};

export const providerService = {
  createProviderProfile,
  getMyProviderProfile,
  getSingleProviderProfile,
};