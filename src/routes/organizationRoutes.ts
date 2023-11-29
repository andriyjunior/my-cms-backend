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

const userPostRoles = [
  UserRoles.ADMIN,
  UserRoles.MANAGER,
  UserRoles.SYSTEM_ADMIN,
];

router.get(
  "/:organizationId",
  verifyAccessToken,
  authorize(userGetRoles),
  organizationController.getOrganizationById
);
router.post(
  "/",
  verifyAccessToken,
  authorize(userPostRoles),
  organizationController.createOrganization
);
router.post("/add-member", organizationController.addMemberToOrganization);

export default router;
