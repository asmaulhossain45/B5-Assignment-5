import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";
import { WalletStatus, WalletType } from "../../constants/enums";

const walletSchema = new Schema<IWallet>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: function (this: IWallet) {
        return !this.isSystem;
      },
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 50,
    },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(WalletType),
      required: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
      immutable: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
