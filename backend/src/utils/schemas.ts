import { z } from "zod";

export const RegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const RunScanSchema = z.object({
  body: z.object({
    url: z.string().url("Invalid target URL. Must be a valid URL starting with http:// or https://"),
  }),
});
