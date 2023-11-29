import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../enums/UserRoles";
import TokenService from "../services/tokenService";
import { AuthenticatedRequest } from "../types/authenticatedTypes";
import "../configs/dotenv";

// Middleware to verify Bearer Token from the Authorization header
export const verifyAccessToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const accessToken = authorizationHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = TokenService.decodeAccessToken(accessToken);

    if (decoded) {
      req.user = decoded as any;
      next();
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(401).json({ error });
  }
};

// Middleware for authorization
export const authorize =
  (requiredRole: UserRoles[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Assuming user roles are included in the JWT payload
    const userRole = req.user?.role;

    // Check if the user has the required role
    if (userRole && requiredRole.includes(userRole as UserRoles)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // User has the required role, proceed to the next middleware or route handler
    next();
  };
