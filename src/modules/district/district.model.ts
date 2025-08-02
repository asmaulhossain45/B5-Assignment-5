import { model, Schema } from "mongoose";
import { IDistrict } from "./district.interface";
import generateSlug from "../../utils/generateSlug";
import { Division } from "../division/division.model";

const districtSchema = new Schema<IDistrict>(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

districtSchema.index({ name: 1, division: 1 }, { unique: true });

districtSchema.pre("save", async function (next) {
  if (this.isModified()) {
    const division = await Division.findById(this.division);
    if (division) {
      const getSlug = generateSlug(this.name);
      this.slug = `${division.name}-${getSlug}-district`;
    }
  }
  next();
});

export const District = model<IDistrict>("District", districtSchema);
