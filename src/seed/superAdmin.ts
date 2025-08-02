/* eslint-disable no-console */
import { envConfig } from "../configs/envConfig";
import { UserRole, UserStatus } from "../constants/enums";
import { Admin } from "../modules/admin/admin.model";

const superAdmin = async () => {
  const isExist = await Admin.findOne({ email: envConfig.SUPER_ADMIN.email });

  if (isExist) {
    console.log("🔥 Super admin already exists.");
    return;
  }

  await Admin.create({
    name: envConfig.SUPER_ADMIN.name,
    email: envConfig.SUPER_ADMIN.email,
    password: envConfig.SUPER_ADMIN.password,
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    isVerified: true,
  });
  console.log("✅ Super Admin Created Successfully");
};

export default superAdmin;
