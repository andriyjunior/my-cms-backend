import { Request, Response } from "express";
import userService from "../services/userService";
import { UserModel } from "../models/userModel";
import { isValidEmail, isValidPassword } from "../utilities/validationUtils";
import { log } from "../logs";
import tokenService from "../services/tokenService";

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const tokens = await userService.login(email, password);

      if (!tokens?.accessToken) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      res.json(tokens);
    } catch (error) {
      console.error("Error in login route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async registration(
    req: Request<unknown, unknown, Partial<UserModel>>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      // Check if email is valid
      if (!isValidEmail(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
      }

      // Check if password is valid
      if (!isValidPassword(password)) {
        res.status(400).json({ error: "Invalid password format" });
        return;
      }

      const user = await userService.createUser({ email, password });

      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      res.json(user);
    } catch (error) {
      log.error("Error in login route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.params;

      if (!refreshToken) {
        res.status(400).json({ error: "Token is not found" });
        return;
      }

      const tokens = tokenService.refreshAccessToken(refreshToken);

      if (!tokens?.newAccessToken) {
        console.error("Error in login route:", tokens);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json({
        token: tokens.newAccessToken,
        refreshToken: tokens.newRefreshToken,
        expiresIn: tokens.expiresIn,
      });
    } catch (error) {
      console.error("Error in login route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const authController = new AuthController();
