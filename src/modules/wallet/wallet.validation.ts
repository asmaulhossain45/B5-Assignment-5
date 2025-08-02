import z from "zod";

const create = z.object({
  owner: z.string(),
});

export const ZodWalletSchema = { create };
