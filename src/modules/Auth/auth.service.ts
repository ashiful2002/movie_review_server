import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";

const createUserIntoDB = async (payload: any) => {
  const password = payload.password;
  const hashedPassword = await bcrypt.hash(password, 8);

  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
  return result;
};

const loginUser = async (payload: any) => {
  const { email } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("user not found");
  }
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("password does not matched");
  }
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  const token = jwt.sign(userData, config.jwt_secret, {
    expiresIn: "1d",
  });

  return {
    token,
    user,
  };
};

export const AuthService = {
  createUserIntoDB,
  loginUser,
};
