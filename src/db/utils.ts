import mongoose from "mongoose";

export const convertToObjectId = (userId: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(userId);
};
