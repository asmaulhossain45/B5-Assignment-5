import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";
import generateSlug from "../../utils/generateSlug";

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const getSlug = generateSlug(this.name);
    this.slug = `${getSlug}-division`;
  }
  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
