import { Types } from "mongoose";
import getAccount from "./getAccount";
import AppError from "../utils/appError";
import { JwtPayload } from "../interfaces";
import HTTP_STATUS from "../constants/httpStatus";
import { Wallet } from "../modules/wallet/wallet.model";
import { IWallet } from "../modules/wallet/wallet.interface";
import { WalletStatus } from "../constants/enums";

interface GetWalletPayload {
  walletId?: Types.ObjectId;
  ownerId?: Types.ObjectId;
  email?: string;
  jwtPayload?: JwtPayload;
  label?: string;
  validate?: boolean;
}

const validWallet = (
  wallet?: IWallet | null,
  label?: string,
  validate?: boolean
): IWallet => {
  if (!wallet) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, `${label} Wallet not found.`);
  }

  if (!validate) return wallet;

  if (wallet.status !== WalletStatus.ACTIVE) {
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      `${label} Wallet is currently ${wallet.status}.`
    );
  }

  return wallet;
};

const getWallet = async ({
  walletId,
  ownerId,
  email,
  jwtPayload,
  label,
  validate = true,
}: GetWalletPayload): Promise<IWallet> => {
  // Get Wallet By Jwt Payload
  if (jwtPayload) {
    const account = await getAccount({ jwtPayload, label });

    const wallet = await Wallet.findOne({ owner: account._id });

    return validWallet(wallet, label, validate);
  }

  // Get Wallet By Wallet Id
  if (walletId) {
    const wallet = await Wallet.findById(walletId);

    return validWallet(wallet, label, validate);
  }

  // Get Wallet By Owner Id
  if (ownerId) {
    const wallet = await Wallet.findOne({ owner: ownerId });

    return validWallet(wallet, label, validate);
  }

  if (email) {
    const account = await getAccount({ email, label });

    const wallet = await Wallet.findOne({ owner: account._id });

    return validWallet(wallet, label, validate);
  }

  throw new AppError(HTTP_STATUS.NOT_FOUND, `${label} Wallet not found.`);
};

export default getWallet;
