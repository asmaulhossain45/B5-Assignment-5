/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { User } from "../user/user.model";
import AppError from "../../utils/appError";
import { Admin } from "../admin/admin.model";
import { Agent } from "../agent/agent.model";
import { IUser } from "../user/user.interface";
import { Wallet } from "../wallet/wallet.model";
import { IAgent } from "../agent/agent.interface";
import { IAdmin } from "../admin/admin.interface";
import isEmailTaken from "../../utils/isEmailTaken";
import HTTP_STATUS from "../../constants/httpStatus";
import { WalletStatus, WalletType } from "../../constants/enums";
import { JwtPayload } from "../../interfaces";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { comparePassword } from "../../utils/bcrypt";
import getAccount from "../../shared/getAccount";

const login = async (payload: Partial<IUser>) => {
  const account = await getAccount({
    email: payload.email as string,
    label: "This",
  });

  const isPasswordMatch = await comparePassword(
    payload.password as string,
    account.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials.");
  }

  const JwtPayload = {
    id: account._id,
    email: account.email,
    role: account.role,
  };

  const accessToken = generateAccessToken(JwtPayload);
  const refreshToken = generateRefreshToken(JwtPayload);

  return { account, accessToken, refreshToken };
};

const setAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token.");
  }

  const { id, email, role } = decoded as JwtPayload;

  await getAccount({ jwtPayload: { id, email, role } });

  const accessToken = generateAccessToken({ id, email, role });

  return accessToken;
};

const registerUser = async (payload: IUser) => {
  const isTaken = await isEmailTaken(payload.email);

  if (isTaken) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [createdUser] = await User.create([payload], { session });
    const [createdWallet] = await Wallet.create(
      [
        {
          owner: createdUser._id,
          type: WalletType.PERSONAL,
        },
      ],
      { session }
    );

    createdUser.wallet = createdWallet._id;
    await createdUser.save({ session });

    await session.commitTransaction();
    return createdUser;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to register user and wallet."
    );
  } finally {
    await session.endSession();
  }
};

const registerAgent = async (payload: IAgent) => {
  const isTaken = await isEmailTaken(payload.email);

  if (isTaken) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [createdAgent] = await Agent.create([payload], { session });
    const [createdWallet] = await Wallet.create(
      [
        {
          owner: createdAgent._id,
          type: WalletType.AGENT,
        },
      ],
      { session }
    );

    createdAgent.wallet = createdWallet._id;
    await createdAgent.save({ session });

    await session.commitTransaction();
    return createdAgent;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to register Agent and wallet."
    );
  } finally {
    await session.endSession();
  }
};

const registerAdmin = async (payload: IAdmin) => {
  const isTaken = await isEmailTaken(payload.email);

  if (isTaken) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }

  const createdAdmin = await Admin.create(payload);

  return createdAdmin;
};

export const authService = {
  login,
  setAccessToken,
  registerUser,
  registerAgent,
  registerAdmin,
};
