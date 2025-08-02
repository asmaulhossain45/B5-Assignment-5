import z from "zod";
import { Gender, UserStatus, WalletStatus } from "../../constants/enums";

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

  location: locationSchema.optional(),
});

const updateUserStatus = z.object({
  status: z.enum(Object.values(UserStatus)),
});

const updateWalletStatus = z.object({
  status: z.enum(Object.values(WalletStatus)),
});

const updateAgentApprovalStatus = z.object({
  isApproved: z.boolean(),
});

export const ZodAdminSchema = {
  create,
  update,
  updateUserStatus,
  updateWalletStatus,
  updateAgentApprovalStatus,
};
