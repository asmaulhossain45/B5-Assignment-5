/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { JwtPayload } from "../interfaces";
import { UserRole, UserStatus } from "../constants/enums";
import { User } from "../modules/user/user.model";
import { Admin } from "../modules/admin/admin.model";
import { Agent } from "../modules/agent/agent.model";
import { Wallet } from "../modules/wallet/wallet.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";

interface GetAccountPayload {
  userId?: Types.ObjectId;
  walletId?: Types.ObjectId;
  email?: string;
  jwtPayload?: JwtPayload;
  label?: string;
  validate?: boolean;
}

const validateAccount = (
  account: any,
  label?: string,
  validate = true
) => {
  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, `${label} Account not found.`);
  }

  if (!validate) return account;

  if (account.isVerified === false) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      `${label} Account is not verified.`
    );
  }

  if (account.isApproved === false) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      `${label} Account is not approved.`
    );
  }

  if (account.status && account.status !== UserStatus.ACTIVE) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      `${label} Account is currently ${account.status}.`
    );
  }

  return account;
};

const getAccount = async ({
  userId,
  walletId,
  email,
  jwtPayload,
  label,
  validate = true,
}: GetAccountPayload) => {
  //   Get Account By Jwt Payload
  if (jwtPayload) {
    let account: any = null;
    const { id, email, role } = jwtPayload;

    switch (role) {
      case UserRole.USER:
        account = await User.findOne({ _id: id, email });
        break;

      case UserRole.AGENT:
        account = await Agent.findOne({ _id: id, email });
        break;

      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        account = await Admin.findOne({ _id: id, email });
        break;
    }

    return validateAccount(account, label, validate);
  }

  if (walletId) {
    const wallet = await Wallet.findById(walletId);

    if (!wallet?.owner) return null;

    const ownerId = wallet.owner as Types.ObjectId;

    const account =
      (await User.findById(ownerId)) ||
      (await Agent.findById(ownerId)) ||
      (await Admin.findById(ownerId));

    return validateAccount(account, label, validate);
  }

  //   Get Account By Only Object id
  if (userId && !email) {
    const account =
      (await User.findById(userId)) ||
      (await Agent.findById(userId)) ||
      (await Admin.findById(userId));

    return validateAccount(account, label, validate);
  }

  //   Get Account By Only Email
  if (email && !userId) {
    const account =
      (await User.findOne({ email })) ||
      (await Agent.findOne({ email })) ||
      (await Admin.findOne({ email }));

    return validateAccount(account, label, validate);
  }

  //   Get Account By Only Email
  if (email && userId) {
    const account =
      (await User.findOne({ _id: userId, email })) ||
      (await Agent.findOne({ _id: userId, email })) ||
      (await Admin.findOne({ _id: userId, email }));

    return validateAccount(account, label, validate);
  }

  throw new AppError(HTTP_STATUS.NOT_FOUND, `${label} Account not found.`);
};

export default getAccount;
