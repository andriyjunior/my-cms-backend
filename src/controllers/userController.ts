import { Request, Response } from "express";
import UserService from "../services/userService";
import { AuthenticatedRequest } from "../types/authenticatedTypes";

class UserController {
  async getUserById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req?.user?.userId;

      if (!userId) {
        res.status(404).json({ error: "User id is empty" });
        return;
      }

      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error getting user by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = req.body;
      const createdUser = await UserService.createUser(newUser);

      if (!createdUser) {
        res.status(500).json({ error: "Failed to create user" });
        return;
      }

      res.status(201).json(createdUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(404).json({ error: "User id is empty" });
        return;
      }

      const updatedUser = req.body;
      const user = await UserService.updateUser(userId, updatedUser);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const success = await UserService.deleteUser(userId);

      if (!success) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new UserController();
