/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../interfaces";
import { envConfig } from "../configs/envConfig";

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, envConfig.JWT.ACCESS_SECRET, {
    expiresIn: envConfig.JWT.ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, envConfig.JWT.REFRESH_SECRET, {
    expiresIn: envConfig.JWT.REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, envConfig.JWT.ACCESS_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, envConfig.JWT.REFRESH_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
