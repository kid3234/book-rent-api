import { z } from "zod";

export const registerSchema = z.object({
  // name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Passeord must be at least 6 characters"),
  // role: z.enum(["admin", "owner", "renter"], "Invalid role"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
