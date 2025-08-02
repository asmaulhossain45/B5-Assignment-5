import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";
import {
  TransactionDirection,
  TransactionRefrence,
  TransactionStatus,
  TransactionType,
  UserRole,
} from "../../constants/enums";

const transactionSchema = new Schema<ITransaction>(
  {
    senderWallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: false,
    },
    receiverWallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    charge: {
      type: Number,
      default: 0,
    },
    agent: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Agent",
      },
      commission: {
        type: Number,
      },
    },
    transactionId: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
      required: true,
    },
    directionForSender: {
      type: String,
      enum: Object.values(TransactionDirection),
      required: true,
    },
    directionForReceiver: {
      type: String,
      enum: Object.values(TransactionDirection),
      required: true,
    },
    initiator: {
      id: {
        type: Schema.Types.ObjectId,
        refpath: "initiator.role",
        required: true,
      },
      role: {
        type: String,
        enum: Object.values(UserRole),
        required: true,
      },
    },

    refrence: {
      type: String,
      enum: Object.values(TransactionRefrence),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
