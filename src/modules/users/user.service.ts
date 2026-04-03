import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt";

export const createUser = async (data: {
  email: string;
  password: string;
  role?: "USER" | "ANALYST" | "ADMIN";
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }
  const hashedPassword = await bcrypt.hash(data.password, 7);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "USER", // redundant as the default is already set to USER but added in case we dont receive the role field.
    },
  });

  return user;
};

export const findUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await findUser(data.email);

  if (!user) throw new Error("User not found.");

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) throw new Error("Access denied: Invalid credentials.");

  if (!user.isActive) throw new Error("Access denied: User inactive.");

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const updateUserRole = async (
  userId: string,
  role: "USER" | "ANALYST" | "ADMIN",
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

export const toggleUserStatus = async (userId: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};
