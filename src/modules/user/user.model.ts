import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { hashPassword } from "../../utils/bcrypt";
import { Gender, UserRole, UserStatus } from "../../constants/enums";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    dob: { type: Date },

    phone: { type: String, unique: true, sparse: true },

    gender: {
      type: String,
      enum: Object.values(Gender),
      lowercase: true,
    },

    role: {
      type: String,
      enum: [UserRole.USER],
      default: UserRole.USER,
      immutable: true,
      lowercase: true,
    },

    location: {
      type: {
        division: {
          type: Schema.Types.ObjectId,
          ref: "Division",
        },
        district: {
          type: Schema.Types.ObjectId,
          ref: "District",
        },
        address: {
          type: String,
          trim: true,
        },
      },
      _id: false,
    },

    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export const User = model<IUser>("User", userSchema);
