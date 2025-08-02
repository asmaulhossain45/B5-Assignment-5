import z from "zod";

const create = z.object({
  name: z.string().min(3).max(25).trim(),
});

const update = z.object({
  name: z.string().min(3).max(25).trim(),
});

export const ZodDivisionSchema = {
  create,
  update,
};
