import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
      isPremium: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      avatar: {
        type: "string",
        required: false,
      },
      isVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      provider: {
        type: "string",
        required: false,
      },
      providerId: {
        type: "string",
        required: false,
      },
    },
  },
});
