import express from "express";
import UserController from "../controllers/userController";
import { authorize, verifyAccessToken } from "../middlewares/authorize";
import { UserRoles } from "../enums/UserRoles";

const router = express.Router();

const userGetRoles = [
  UserRoles.ADMIN,
  UserRoles.CUSTOMER,
  UserRoles.MANAGER,
  UserRoles.GUEST,
  UserRoles.SYSTEM_ADMIN,
];

const userPutRoles = [
  UserRoles.ADMIN,
  UserRoles.CUSTOMER,
  UserRoles.MANAGER,
  UserRoles.SYSTEM_ADMIN,
];

const userDeleteRoles = [UserRoles.ADMIN, UserRoles.SYSTEM_ADMIN];

router.get(
  "/",
  verifyAccessToken,
  authorize(userGetRoles),
  UserController.getUserById
);
router.put(
  "/",
  verifyAccessToken,
  authorize(userPutRoles),
  UserController.updateUser
);
router.delete(
  "/",
  verifyAccessToken,
  authorize(userDeleteRoles),
  UserController.deleteUser
);

export default router;
