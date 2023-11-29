import { Request } from "express";
import { UserModel } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}
