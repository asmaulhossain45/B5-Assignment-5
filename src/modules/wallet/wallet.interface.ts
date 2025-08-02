import { Types } from "mongoose";
import { WalletStatus, WalletType } from "../../constants/enums";

export interface IWallet {
  _id?: Types.ObjectId;
  owner?: Types.ObjectId;
  balance: number;
  type: WalletType;
  status: WalletStatus;
  isSystem: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
