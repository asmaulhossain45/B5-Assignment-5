import z from "zod";

const topUp = z.object({
  amount: z.number().min(1),
});

const withdraw = z.object({
  amount: z.number().min(1),
});

const sendMoney = z.object({
  amount: z.number().min(1),
  receiver: z.string(),
});

const cashIn = z.object({
  amount: z.number().min(1),
  receiver: z.string(),
});

const cashOut = z.object({
  amount: z.number().min(1),
  sender: z.string(),
});

export const ZodTransactionSchema = {
  topUp,
  withdraw,
  sendMoney,
  cashIn,
  cashOut,
};
