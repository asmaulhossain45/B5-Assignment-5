import z from "zod";
import { Gender } from "../../constants/enums";

const locationSchema = z.object({
  division: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
});

const create = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  dob: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(Object.values(Gender)).optional(),

  businessName: z.string().max(50).optional(),
  location: locationSchema.optional(),
});

const update = z.object({
  name: z.string().min(1, "Name is required").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),

  dob: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(Object.values(Gender)).optional(),

  businessName: z.string().max(50).optional(),
  location: locationSchema.optional(),
});

export const ZodAgentSchema = {
  create,
  update,
};
