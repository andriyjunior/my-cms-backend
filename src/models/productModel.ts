// models/ProductModel.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ProductModel extends Document {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  brand: string;
  attributes?: Array<{ key: string; value: any }>;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: "Category" }, // Reference to Category model
    brand: { type: Schema.Types.ObjectId, ref: "Brand" }, // Reference to Brand model
    attributes: [{ key: String, value: Schema.Types.Mixed }],
  },
  { timestamps: true }
);

const Product = mongoose.model<ProductModel>("Product", productSchema);

export default Product;
