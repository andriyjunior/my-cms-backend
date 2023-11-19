import mongoose, { Document, Schema } from "mongoose";

export interface OrganizationModel extends Document {
  name: string;
  admin: string;
  description?: string;
  members: string[]; // Assuming members are stored as user IDs
  products: string[]; // Assuming products are stored as product IDs
  orders: string[]; // Assuming orders are stored as order IDs
}

const organizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }], // Reference to User model
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Reference to Product model
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }], // Reference to Order model
  },
  { timestamps: true }
);

const Organization = mongoose.model<OrganizationModel>(
  "Organization",
  organizationSchema
);

export default Organization;
