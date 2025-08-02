import { Types } from "mongoose";
import { UserRole, UserStatus, WalletStatus } from "../../constants/enums";
import HTTP_STATUS from "../../constants/httpStatus";
import { JwtPayload } from "../../interfaces";
import getAccount from "../../shared/getAccount";
import AppError from "../../utils/appError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Agent } from "../agent/agent.model";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";

const getAdminProfile = async (payload: JwtPayload) => {
  const account = await getAccount({ jwtPayload: payload, label: "Your" });

  return account;
};

const updateAdminProfile = async (
  user: JwtPayload,
  payload: Partial<IAdmin>
) => {
  const userId = user.id;

  await getAccount({ jwtPayload: user, label: "Your" });

  const updatedUser = await Admin.findByIdAndUpdate(
    userId,
    {
      $set: payload,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Admin update failed.");
  }

  return updatedUser;
};

const getAllAdmins = async (query: Record<string, string>) => {
  const searchableFields = ["name", "email"];
  const queryBuilder = new QueryBuilder(Admin.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const admins = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: admins, meta };
};

const getAllAgents = async (query: Record<string, string>) => {
  const searchableFields = ["name", "email"];
  const queryBuilder = new QueryBuilder(Agent.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const agents = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: agents, meta };
};

const getAllUsers = async (query: Record<string, string>) => {
  const searchableFields = ["name", "email"];
  const queryBuilder = new QueryBuilder(User.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const users = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: users, meta };
};

const getAllWallet = async (query: Record<string, string>) => {
  const searchableFields = ["type", "status"];
  const queryBuilder = new QueryBuilder(Wallet.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const wallets = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: wallets, meta };
};

const getAllTransactions = async (query: Record<string, string>) => {
  const searchableFields = ["type", "status"];
  const queryBuilder = new QueryBuilder(Transaction.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const transactions = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: transactions, meta };
};

const updateUserStatusByUserEmail = async (
  email: string,
  status: UserStatus
) => {
  const account = await getAccount({ email, label: "Target", validate: false });
  const { role, _id } = account;

  let updatedAccount = null;

  switch (role) {
    case UserRole.USER:
      updatedAccount = await User.findByIdAndUpdate(
        { _id },
        { $set: { status } },
        { new: true, runValidators: true }
      );
      break;

    case UserRole.AGENT:
      updatedAccount = await Agent.findByIdAndUpdate(
        { _id },
        { $set: { status } },
        { new: true, runValidators: true }
      );
      break;

    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
      updatedAccount = await Admin.findByIdAndUpdate(
        { _id },
        { $set: { status } },
        { new: true, runValidators: true }
      );
      break;

    default:
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Invalid role.");
  }

  if (!updatedAccount) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Update status failed.");
  }

  return updatedAccount;
};

const updateWalletStatusByOwner = async (
  ownerId: string | Types.ObjectId,
  status: WalletStatus
) => {
  const updatedWallet = await Wallet.findOneAndUpdate(
    { owner: ownerId },
    { $set: { status } },
    { new: true, runValidators: true }
  );

  if (!updatedWallet) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Update status failed.");
  }

  return updatedWallet;
};

const updateAgentApprovalStatus = async (
  email: string,
  isApproved: boolean
) => {
  const updatedAgent = await Agent.findOneAndUpdate(
    { email: email },
    { $set: { isApproved } },
    { new: true, runValidators: true }
  );

  if (!updatedAgent) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Update status failed.");
  }

  return updatedAgent;
};

export const adminService = {
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  getAllAgents,
  getAllUsers,
  getAllWallet,
  getAllTransactions,
  updateUserStatusByUserEmail,
  updateWalletStatusByOwner,
  updateAgentApprovalStatus,
};
