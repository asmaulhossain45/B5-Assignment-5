import { model, Schema } from "mongoose";
import { IAdmin } from "./admin.interface";
import { hashPassword } from "../../utils/bcrypt";
import { Gender, UserRole, UserStatus } from "../../constants/enums";

const adminSchema = new Schema<IAdmin>(
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
      enum: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      default: UserRole.ADMIN,
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

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export const Admin = model<IAdmin>("Admin", adminSchema);
