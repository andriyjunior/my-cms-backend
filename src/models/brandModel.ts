import mongoose, { Schema, Document } from "mongoose";

export interface BrandModel extends Document {
  name: string;
  description?: string;
}

const brandSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Brand = mongoose.model<BrandModel>("Brand", brandSchema);

export default Brand;
