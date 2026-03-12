import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";
const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash("asdf1234", 8);

  const adminData = {
    name: "Admin",
    email: "admin@foodhub.com",
    role: UserRole.ADMIN,
    password: hashedPassword,
  };
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (userExists) {
      console.log("admin already exists!");
      return;
    }
      await prisma.user.create({
      data: adminData,
    });

    console.log("admin created successfully");
  } catch (error: any) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};
seedAdmin();
