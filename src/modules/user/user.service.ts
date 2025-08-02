import { User } from "./user.model";
import AppError from "../../utils/appError";
import { JwtPayload } from "../../interfaces";
import HTTP_STATUS from "../../constants/httpStatus";
import { ITransactionPayload } from "../transaction/transaction.interface";
import executeTransaction from "../../shared/executeTransaction";
import {
  TransactionDirection,
  TransactionRefrence,
  TransactionType,
} from "../../constants/enums";
import { QueryBuilder } from "../../utils/queryBuilder";
import getAccount from "../../shared/getAccount";
import getWallet from "../../shared/getWallet";
import { Transaction } from "../transaction/transaction.model";
import { IUser } from "./user.interface";

const getUserProfile = async (payload: JwtPayload) => {
  const account = await getAccount({ jwtPayload: payload, label: "Your" });

  return account;
};

const updateProfile = async (user: JwtPayload, payload: Partial<IUser>) => {
  const userId = user.id;

  await getAccount({ jwtPayload: user, label: "Your" });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: payload,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User update failed.");
  }

  return updatedUser;
};

const getUserWallet = async (payload: JwtPayload) => {
  const wallet = await getWallet({ jwtPayload: payload, label: "Your" });

  return wallet;
};

const getTransactions = async (
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

const topUp = async (amount: number, user: JwtPayload) => {
  const account = await getAccount({ jwtPayload: user, label: "Your" });
  await getWallet({ jwtPayload: user, label: "Your" });

  const transactionPayload: ITransactionPayload = {
    receiverWallet: account.wallet,
    amount: amount,
    isCharge: false,
    type: TransactionType.ADD_MONEY,
    directionForSender: TransactionDirection.DEBIT,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: account.id,
      role: account.role,
    },
    refrence: TransactionRefrence.BANK,
  };

  const transaction = await executeTransaction(transactionPayload);

  return transaction;
};

const withdraw = async (amount: number, user: JwtPayload) => {
  const account = await getAccount({ jwtPayload: user, label: "Your" });
  await getWallet({ jwtPayload: user, label: "Your" });

  const transactionPayload: ITransactionPayload = {
    senderWallet: account.wallet,
    amount: amount,
    isCharge: false,
    type: TransactionType.WITHDRAW,
    directionForSender: TransactionDirection.DEBIT,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: account.id,
      role: account.role,
    },
    refrence: TransactionRefrence.BANK,
  };

  const transaction = await executeTransaction(transactionPayload);

  return transaction;
};

const sendMoney = async (
  amount: number,
  user: JwtPayload,
  receiver: string
) => {
  const senderAccount = await getAccount({ jwtPayload: user, label: "Your" });
  const receiverAccount = await getAccount({
    email: receiver,
    label: "Receiver",
  });
  await getWallet({ walletId: senderAccount.wallet, label: "Sender" });
  await getWallet({ walletId: receiverAccount.wallet, label: "Sender" });

  const transactionPayload: ITransactionPayload = {
    senderWallet: senderAccount.wallet,
    receiverWallet: receiverAccount.wallet,
    amount: amount,
    isCharge: true,
    type: TransactionType.SEND_MONEY,
    directionForSender: TransactionDirection.DEBIT,
    directionForReceiver: TransactionDirection.CREDIT,
    initiator: {
      id: senderAccount.id,
      role: senderAccount.role,
    },
  };

  const transaction = await executeTransaction(transactionPayload);

  return transaction;
};

export const userService = {
  getUserProfile,
  updateProfile,
  getUserWallet,
  getTransactions,
  topUp,
  withdraw,
  sendMoney,
};
