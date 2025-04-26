import { z } from "zod";

export const SignupFormSchema = z
  .object({
    role: z.enum(["user", "owner"]),
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be valid" }),
    nidNumber: z
      .string()
      .min(10, {
        message: "NID number must be valid",
      })
      .regex(/^\d+$/, {
        message: "NID number must be numeric",
      }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const SignInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});

export const CreateApartmentFormSchema = z.object({
  totalRooms: z.number().min(1, { message: "Total rooms is required" }),
  bedrooms: z
    .number()
    .min(1, { message: "Number of bedrooms is required" })
    .max(10),
  bathrooms: z
    .number()
    .min(1, { message: "Number of bathrooms is required" })
    .max(10),
  hasParking: z.boolean().optional(),
  hasElevator: z.boolean().optional(),
  street: z.string().min(1, { message: "Street is required" }),
  city: z.string().min(1, { message: "City is required" }),

  area: z.string().min(1, { message: "Area is required" }),
  rentalPrice: z.number().min(1, { message: "Rental price is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  totalFloors: z.number().min(1, { message: "Total floors is required" }),
  floor: z.number().min(1, { message: "Floor is required" }),
});
