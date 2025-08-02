import {
  TransactionDirection,
  TransactionType,
  UserRole,
} from "../../constants/enums";
import { Agent } from "./agent.model";
import { IAgent } from "./agent.interface";
import AppError from "../../utils/appError";
import { JwtPayload } from "../../interfaces";
import getWallet from "../../shared/getWallet";
import getAccount from "../../shared/getAccount";
import HTTP_STATUS from "../../constants/httpStatus";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Transaction } from "../transaction/transaction.model";
import executeTransaction from "../../shared/executeTransaction";
import { ITransactionPayload } from "../transaction/transaction.interface";
import mongoose, { Types } from "mongoose";

const getAgentProfile = async (payload: JwtPayload) => {
  const account = await getAccount({ jwtPayload: payload, label: "Your" });

  return account;
};

const getAgentWallet = async (payload: JwtPayload) => {
  const wallet = await getWallet({ jwtPayload: payload, label: "Your" });

  return wallet;
};

const getAgentTransactions = async (
  user: JwtPayload,
  query: Record<string, string>
) => {
  const wallet = await getWallet({ jwtPayload: user, label: "Your" });
  const walletId = wallet._id;

  const searchableFields = ["type", "status"];

  const baseQuery = Transaction.find({
    $or: [{ senderWallet: walletId }, { receiverWallet: walletId }],
  });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const transactions = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: transactions, meta };
};

const getCommisionHistory = async (
  id: string | Types.ObjectId,
  query: Record<string, string>
) => {
  const objectId = new mongoose.Types.ObjectId(id);
  const baseQuery = Transaction.find({
    "agent.id": objectId,
    "agent.commission": { $gt: 0 },
  });

  const querybuilder = new QueryBuilder(baseQuery, query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const history = await querybuilder.build();
  const meta = await querybuilder.getMeta();

  return { data: history, meta };
};

const updateAgentProfile = async (
  user: JwtPayload,
  payload: Partial<IAgent>
) => {
  const userId = user.id;

  await getAccount({ jwtPayload: user, label: "Your" });

  const updatedAgent = await Agent.findByIdAndUpdate(
    userId,
    {
      $set: payload,
    },
    { new: true, runValidators: true }
  );

  if (!updatedAgent) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Agent update failed.");
  }

  return updatedAgent;
};

const cashIn = async (amount: number, user: JwtPayload, receiver: string) => {
  const agentAccount = await getAccount({ jwtPayload: user, label: "Agent" });

  const receiverAccount = await getAccount({
    email: receiver,
    label: "Receiver",
  });

  await getWallet({ walletId: agentAccount.wallet });
  await getWallet({ walletId: receiverAccount.wallet });

  const transactionPayload: ITransactionPayload = {
    senderWallet: agentAccount.wallet,
    receiverWallet: receiverAccount.wallet,
    amount: amount,
    isCharge: false,
    type: TransactionType.CASH_IN,
    directionForSender: TransactionDirection.DEBIT,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: agentAccount._id,
      role: UserRole.AGENT,
    },
  };

  const transaction = await executeTransaction(transactionPayload);

  return transaction;
};

const cashOut = async (amount: number, user: JwtPayload, sender: string) => {
  const receiverAccount = await getAccount({
    jwtPayload: user,
    label: "Agent",
  });

  const senderAccount = await getAccount({
    email: sender,
    label: "Sender",
  });

  await getWallet({ walletId: receiverAccount.wallet });
  await getWallet({ walletId: senderAccount.wallet });

  const transactionPayload: ITransactionPayload = {
    senderWallet: senderAccount.wallet,
    receiverWallet: receiverAccount.wallet,
    amount: amount,
    isCharge: true,
    agentId: receiverAccount.id,
    type: TransactionType.CASH_OUT,
    directionForSender: TransactionDirection.DEBIT,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: receiverAccount.id,
      role: receiverAccount.role,
    },
  };
  const transaction = await executeTransaction(transactionPayload);
  return transaction;
};

export const agentService = {
  cashIn,
  cashOut,
  getAgentProfile,
  getAgentWallet,
  getAgentTransactions,
  getCommisionHistory,
  updateAgentProfile,
};
