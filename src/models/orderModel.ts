import mongoose, { Schema, Document } from "mongoose";
import { ProductModel } from "./productModel";

interface OrderItem {
  product: Schema.Types.ObjectId | ProductModel;
  quantity: number;
}

export interface OrderModel extends Document {
  user: Schema.Types.ObjectId; // Assuming you have a User model
  items: OrderItem[];
  totalPrice: number;
  status: string;
}

const orderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model<OrderModel>("Order", orderSchema);

export default Order;
