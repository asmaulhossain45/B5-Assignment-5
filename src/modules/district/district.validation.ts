import z from "zod";

const create = z.object({
  name: z.string().min(3).max(25).trim(),
  division: z.string(),
});

const update = z.object({
  name: z.string().min(3).max(25).trim().optional(),
  division: z.string().optional(),
});

export const ZodDistrictSchema = {
  create,
  update,
};
