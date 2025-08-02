import { Types } from "mongoose";
import { Gender, UserRole, UserStatus } from "../../constants/enums";
import { ILocation } from "../../interfaces/common.interface";

export interface IAdmin {
  _id?: Types.ObjectId;

  name: string;
  email: string;
  password: string;

  dob?: Date;
  phone?: string;
  gender?: Gender;
  role: UserRole.ADMIN | UserRole.SUPER_ADMIN;
  location?: ILocation;

  status: UserStatus;
  isVerified: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
