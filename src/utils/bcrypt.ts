import bcrypt from "bcrypt";
import { envConfig } from "../configs/envConfig";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, envConfig.JWT.SALT_ROUND);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
