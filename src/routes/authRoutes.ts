import { Router, Request, Response } from "express";

import { authController } from "../controllers/authController";

const router = Router();

router.post("/login", authController.login);
router.post("/registration", authController.registration);
router.post("/refresh-token/:refreshToken", authController.refreshAccessToken);

export default router;
