/* eslint-disable no-console */
import { envConfig } from "../configs/envConfig";
import { WalletStatus, WalletType } from "../constants/enums";
import { Admin } from "../modules/admin/admin.model";
import { Wallet } from "../modules/wallet/wallet.model";

const systemWallet = async () => {
  const isExist = await Wallet.findOne({ isSystem: true });

  if (isExist) {
    console.log("🔥 System wallet already exists.");
    return;
  }

  const superAdmin = await Admin.findOne({
    email: envConfig.SUPER_ADMIN.email,
  });

  if (!superAdmin) {
    console.log("⚠️ Super admin must exist before creating system wallet.");
    return;
  }

  await Wallet.create({
    owner: superAdmin._id,
    balance: 0,
    status: WalletStatus.ACTIVE,
    type: WalletType.SYSTEM,
    isSystem: true,
  });
  console.log("✅ System Wallet Created Successfully");
};

export default systemWallet;
