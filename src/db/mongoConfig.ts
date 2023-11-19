import mongoose from "mongoose";
import { log } from "../logs";

import "../configs/dotenv";
import superAdminService from "../services/superAdminService";
import Product from "../models/productModel";
import Order from "../models/orderModel";
import Brand from "../models/brandModel";
import Category from "../models/categoryModel";

class MongoConfig {
  private readonly url: string;

  constructor() {
    this.url = process.env.MONGO_URI || "mongodb://localhost:27017/admin-test";
  }

  private async connectToMongoDB(): Promise<void> {
    try {
      await mongoose.connect(this.url);
      log.success("Database has been connected successfully");
    } catch (error) {
      log.error("Error occurs during database connection " + error);
    }
  }

  setupSchemas() {
    Product;
    Order;
    Brand;
    Category;
  }

  public async initialize(): Promise<void> {
    await this.connectToMongoDB();
    superAdminService.createSuperAdmin();
    this.setupSchemas();
  }
}

export const mongoConnection = new MongoConfig();
