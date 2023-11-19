import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { mongoConnection } from "./db/mongoConfig";
import { log } from "./logs";
import crypto from "crypto";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import organizationRoutes from "./routes/organizationRoutes";

import "./configs/dotenv";

const PORT = process.env.PORT || 8080;

class Server {
  private readonly app: express.Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private setupRoutes(): void {
    this.app.use("/user", userRoutes);
    this.app.use("/auth", authRoutes);
    this.app.use("/organization", organizationRoutes);
  }

  public start(): void {
    this.initializeMongoDB();
    this.app.listen(PORT, () => {
      log.success(`Server running on ${PORT}`);
    });
  }

  private async initializeMongoDB(): Promise<void> {
    await mongoConnection.initialize();
  }
}

// Generate a random string of a specified length
function generateRandomString(length: number) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

console.log(generateRandomString(6));

const server = new Server();
server.start();
