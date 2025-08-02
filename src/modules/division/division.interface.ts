import { Types } from "mongoose";

export interface IDivision {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}
