import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.any().optional(),
  icon: z.string().optional()
});

export const categoryUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.any().optional(),
  icon: z.string().optional()
});
