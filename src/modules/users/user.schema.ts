import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(5, "Password must be 5 or more characters.")
    .max(50, "Password must be smaller than 50 characters"),
  role: z
    .enum(["USER", "ANALYST", "ADMIN"], "Role must be USER, ANALYST or ADMIN.")
    .optional(),
});

export const loginUserSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(5, "Password must be 5 or more characters.")
    .max(50, "Password must be smaller than 50 characters"),
});


export const updateRoleSchema = z.object({
  role: z.enum(["USER", "ANALYST", "ADMIN"]),
});

export const toggleStatusSchema = z.object({
  isActive: z.boolean(),
});