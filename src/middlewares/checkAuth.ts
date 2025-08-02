import AppError from "../utils/appError";
import { JwtPayload } from "../interfaces";
import { UserRole } from "../constants/enums";
import getAccount from "../shared/getAccount";
import { verifyAccessToken } from "../utils/jwt";
import HTTP_STATUS from "../constants/httpStatus";
import { NextFunction, Request, Response } from "express";

const checkAuth =
  (...allowedRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          "Please logged in and try again."
        );
      }

      const decoded = verifyAccessToken(token);

      if (!decoded) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          "Please logged in and try again."
        );
      }

      const { id, email, role } = decoded as JwtPayload;

      if (!allowedRoles.includes(role)) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          "You do not have permission"
        );
      }
      const jwtPayload: JwtPayload = {
        id,
        email,
        role,
      };

      await getAccount({ jwtPayload, label: role });

      req.user = decoded as JwtPayload;

      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
