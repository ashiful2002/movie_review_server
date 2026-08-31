import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { envVars } from "../../config/env";
import { User, UserRole } from "../../../generated/prisma";
import { auth } from "../../lib/auth";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";


interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface ILoginUserPayload {
  email: string;
  password: string;
}
const createUser = async (payload: IRegisterPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      // role: UserRole.USER,
    },
  });

  if (!data.user) {
    throw new Error("Failed to register user");
  }

  return data;
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  if (data.user.isDeleted) {
    throw new Error(" User is deleted");
  }
  return data;
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );

  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};

const logoutUser = async (token?: string) => {
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", token);
  }
  const result = await auth.api.signOut({
    headers,
  });

  return result;
};
const getMe = async (id: string) => {
  console.log(id);

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return { user };
};
export const AuthService = {
  createUser,
  loginUser,
  getNewToken,
  logoutUser,
  getMe,
};
