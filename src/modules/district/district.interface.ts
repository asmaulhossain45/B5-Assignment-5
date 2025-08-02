import { Types } from "mongoose";

export interface IDistrict {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  division: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
