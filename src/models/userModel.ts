import mongoose, { Document, Schema } from "mongoose";
import { UserRoles } from "../enums/UserRoles";
import { OrganizationModel } from "./organizationModel";

interface UserInfoModel {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
}

export interface UserModel extends Document {
  username: string;
  email: string;
  role: UserRoles;
  password: string;
  userInfo: UserInfoModel;
  organizations?: string[];
}

const userInfoSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
});

const userSchema: Schema = new Schema(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.ADMIN,
      require: true,
    },
    password: { type: String, required: true },
    userInfo: userInfoSchema,
    organizations: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
  },
  { timestamps: true }
);

export const User = mongoose.model<UserModel>("User", userSchema);
