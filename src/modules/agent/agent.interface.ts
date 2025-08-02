import { Types } from "mongoose";
import { Gender, UserRole, UserStatus } from "../../constants/enums";

export interface IAgent {
  _id?: Types.ObjectId;

  name: string;
  email: string;
  password: string;

  dob?: Date;
  phone?: string;
  gender?: Gender;

  role: UserRole.AGENT;

  businessName?: string;
  location?: {
    division?: string;
    district?: string;
    address?: string;
  };

  status: UserStatus;
  wallet?: Types.ObjectId;

  isApproved: boolean;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
