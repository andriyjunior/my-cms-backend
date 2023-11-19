import { Request, Response } from "express";
import organizationService from "../services/organizationService";
import userService from "../services/userService";
import { isValidEmail } from "../utilities/validationUtils";
import { log } from "../logs";

class OrganizationController {
  async getOrganizationById(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const organization = await organizationService.getOrganizationById(
        organizationId
      );

      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      res.json(organization);
    } catch (error) {
      console.error("Error in getOrganizationById:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async createOrganization(req: Request, res: Response) {
    try {
      const newOrganizationData = req.body;
      const newOrganization = await organizationService.createOrganization(
        newOrganizationData
      );

      if (newOrganization) {
        userService.addOrganizationToUser(
          newOrganization.admin,
          newOrganization._id
        );
      }

      if (!newOrganization) {
        return res.status(500).json({ error: "Error creating organization" });
      }

      res.json(newOrganization);
    } catch (error) {
      console.error("Error in createOrganization:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async addMemberToOrganization(req: Request, res: Response) {
    try {
      const { email, organizationId } = req.body;

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const organization = await organizationService.getOrganizationById(
        organizationId
      );

      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      await organizationService.addMember(email, organization._id);
      res.json({ message: "Member has been saved successfully" });
    } catch (error) {
      log.error(
        "Error in addMemberToOrganization:",
        error
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new OrganizationController();
