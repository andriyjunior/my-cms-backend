import express from "express";
import organizationController from "../controllers/organizationController";
import { authorize, verifyAccessToken } from "../middlewares/authorize";
import { UserRoles } from "../enums/UserRoles";

const router = express.Router();

const userGetRoles = [
  UserRoles.ADMIN,
  UserRoles.MANAGER,
  UserRoles.SYSTEM_ADMIN,
];

router.get(
  "/:page/:limit",
  verifyAccessToken,
  authorize(userGetRoles),
  organizationController.getOrganizationsByUserId
);

export default router;
