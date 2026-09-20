import { z } from "zod";

export const WEIGHT_TYPES = [
    { label: "Milliliter (ml)", value: "ml" },
    { label: "Liter", value: "liter" },
    { label: "Gram (gm)", value: "gm" },
    { label: "Kilogram (kg)", value: "kg" },
];

const positiveNumber = z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .refine((v) => v !== "" && v !== null && v !== undefined, {
        message: "This field is required",
    })
    .transform((v) => Number(v))
    .refine((n) => !Number.isNaN(n), { message: "Must be a valid number" });

export const productSchema = z.object({
    categoryId: z
        .union([z.string(), z.number()])
        .transform((v) => (typeof v === "string" ? Number(v) : v))
        .refine((n) => !Number.isNaN(n) && n > 0, {
            message: "Category is required",
        }),
    name: z
        .string()
        .min(2, "Product name must be at least 2 characters")
        .max(200, "Product name must be at most 200 characters"),
    description: z.string().optional().or(z.literal("")),
    weight: positiveNumber.refine((n) => n > 0, {
        message: "Weight must be greater than 0",
    }),
    weight_type: z.string().min(1, "Weight type is required"),
    quantity: positiveNumber.refine((n) => n >= 0, {
        message: "Quantity must be 0 or greater",
    }),
    price: positiveNumber.refine((n) => n > 0, {
        message: "Price must be greater than 0",
    }),
    image: z.any().optional(),
});

export const productUpdateSchema = z.object({
    categoryId: z
        .union([z.string(), z.number()])
        .transform((v) => (typeof v === "string" ? Number(v) : v))
        .refine((n) => !Number.isNaN(n) && n > 0, {
            message: "Category is required",
        }),
    name: z
        .string()
        .min(2, "Product name must be at least 2 characters")
        .max(200, "Product name must be at most 200 characters"),
    description: z.string().optional().or(z.literal("")),
    weight: positiveNumber.refine((n) => n > 0, {
        message: "Weight must be greater than 0",
    }),
    weight_type: z.string().min(1, "Weight type is required"),
    quantity: positiveNumber.refine((n) => n >= 0, {
        message: "Quantity must be 0 or greater",
    }),
    price: positiveNumber.refine((n) => n > 0, {
        message: "Price must be greater than 0",
    }),
    image: z.any().optional(),
});
