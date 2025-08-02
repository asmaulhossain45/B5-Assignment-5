import z from "zod";

const register = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

const login = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const changePassword = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const ZodAuthSchema = {
  login,
  register,
  changePassword,
};
