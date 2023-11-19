// models/CategoryModel.ts

import mongoose, { Schema, Document } from "mongoose";

export interface CategoryModel extends Document {
  name: string;
  description?: string;
}

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.model<CategoryModel>("Category", categorySchema);

export default Category;
