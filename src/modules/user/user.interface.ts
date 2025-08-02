import { Types } from "mongoose";
import { ILocation } from "../../interfaces/common.interface";
import { Gender, UserRole, UserStatus } from "../../constants/enums";

export interface IUser {
  _id?: Types.ObjectId;

  name: string;
  email: string;
  password: string;

  dob?: Date;
  phone?: string;
  gender?: Gender;
  role: UserRole.USER;
  location?: ILocation;

  wallet?: Types.ObjectId;

  status: UserStatus;
  isVerified: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
