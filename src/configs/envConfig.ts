import dotenv from "dotenv";
import { NodeEnv } from "../constants/enums";

dotenv.config();

interface IDatabase {
  URI: string;
  NAME: string;
}

interface IJWT {
  SALT_ROUND: number;
  ACCESS_SECRET: string;
  REFRESH_SECRET: string;
  ACCESS_EXPIRES_IN: string;
  REFRESH_EXPIRES_IN: string;
}

interface IBaseUrl {
  BACKEND_URL: string;
  FRONTEND_URL: string;
}

interface ISuperAdmin {
  name: string;
  email: string;
  password: string;
}

interface IPercentage {
  SYSTEM_CHARGE: number;
  AGENT_COMMISION: number;
}

interface EnvConfig {
  PORT: number;
  NODE_ENV: NodeEnv;
  DATABASE: IDatabase;
  JWT: IJWT;
  BASE_URL: IBaseUrl;
  SUPER_ADMIN: ISuperAdmin;
  PERCENTAGE: IPercentage;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "NODE_ENV",
    "DB_URI",
    "DB_NAME",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRES_IN",
    "JWT_REFRESH_EXPIRES_IN",
    "BACKEND_URL",
    "FRONTEND_URL",
    "SUPER_ADMIN_NAME",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "PERCENTAGE_SYSTEM_CHARGE",
    "PERCENTAGE_AGENT_COMMISION",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing ${key} environment variable.`);
    }
  });

  return {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV as NodeEnv,
    DATABASE: {
      URI: process.env.DB_URI as string,
      NAME: process.env.DB_NAME as string,
    },
    JWT: {
      SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
      ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
      REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
      ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
      REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    },
    BASE_URL: {
      BACKEND_URL: process.env.BACKEND_URL as string,
      FRONTEND_URL: process.env.FRONTEND_URL as string,
    },
    SUPER_ADMIN: {
      name: process.env.SUPER_ADMIN_NAME as string,
      email: process.env.SUPER_ADMIN_EMAIL as string,
      password: process.env.SUPER_ADMIN_PASSWORD as string,
    },
    PERCENTAGE: {
      SYSTEM_CHARGE: Number(process.env.PERCENTAGE_SYSTEM_CHARGE),
      AGENT_COMMISION: Number(process.env.PERCENTAGE_AGENT_COMMISION),
    },
  };
};

export const envConfig = loadEnvVariables();
