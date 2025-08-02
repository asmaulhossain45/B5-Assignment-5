import { Types } from "mongoose";

export interface ILocation {
  division: Types.ObjectId;
  district: Types.ObjectId;
  address: string;
}
