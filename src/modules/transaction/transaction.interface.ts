import { Types } from "mongoose";
import {
  TransactionDirection,
  TransactionRefrence,
  TransactionStatus,
  TransactionType,
  UserRole,
} from "../../constants/enums";

export interface ITransaction {
  _id?: Types.ObjectId;

  senderWallet?: Types.ObjectId;
  receiverWallet?: Types.ObjectId;

  amount: number;
  charge: number;
  agent?: {
    id: Types.ObjectId;
    commission: number;
  };

  transactionId?: string;
  type: TransactionType;
  status: TransactionStatus;

  directionForSender: TransactionDirection;
  directionForReceiver: TransactionDirection;

  initiator: {
    id: Types.ObjectId;
    role: UserRole;
  };

  refrence?: TransactionRefrence;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionPayload {
  senderWallet?: Types.ObjectId;
  receiverWallet?: Types.ObjectId;

  amount: number;
  isCharge?: boolean;
  agentId?: Types.ObjectId;

  type: TransactionType;

  directionForSender: TransactionDirection;
  directionForReceiver: TransactionDirection;

  initiator: {
    id: Types.ObjectId;
    role: UserRole;
  };

  refrence?: TransactionRefrence;
}
