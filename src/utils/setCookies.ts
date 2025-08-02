import { Response } from "express";

export interface IAuthCookies {
  res: Response;
  accessToken?: string;
  refreshToken?: string;
}

export const setCookies = ({
  res,
  accessToken,
  refreshToken,
}: IAuthCookies) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
