import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";

const createUser = async (payload: any) => {
  console.log("Service: createUser", payload);
  const password = payload.password;
  const hashedPassword = await bcrypt.hash(password, 8);

  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
  return result;
};

const loginUser = async (payload: any) => {
  console.log("Service: loginUser", payload);
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
    isPremium: user.isPremium,
  };
  const token = jwt.sign(userData, config.jwt_secret, {
    expiresIn: "1d",
  });

  return {
    token,
    user,
  };
};

const logoutUser = async () => {
  console.log("Service: logoutUser");

  return null;
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

const updateProfile = async (userId: string, payload: any) => {
  const allowedFields = [
    "name",
    "phone",
    "avatar",
    "street",
    "city",
    "postalCode",
    "address",
  ];

  const data: any = {};
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = payload[field];
    }
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return { user: updatedUser };
};
export const AuthService = {
  createUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
};
