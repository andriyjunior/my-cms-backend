import express from "express";
import organizationController from "../controllers/organizationController";

const router = express.Router();

router.get("/:organizationId", organizationController.getOrganizationById);
router.post("/", organizationController.createOrganization);
router.post("/add-member", organizationController.addMemberToOrganization);

export default router;
