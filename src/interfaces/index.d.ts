import { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import { UserRole } from "../constants/enums";
import { Types } from "mongoose";

export interface JwtPayload extends DefaultJwtPayload {
  id: Types.ObjectId;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
