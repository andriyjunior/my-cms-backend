import { Request, Response } from "express";
import organizationService from "../services/organizationService";
import userService from "../services/userService";
import { isValidEmail } from "../utilities/validationUtils";
import { log } from "../logs";
import { AuthenticatedRequest } from "../types/authenticatedTypes";

class OrganizationController {
  async getOrganizations(req: Request, res: Response) {
    try {
      const { page, limit } = req.params;
      const organizations = await organizationService.getPaginatedOrganizations(
        Number(page),
        Number(limit)
      );

      if (!organizations) {
        return res.status(404).json({ error: "Organizations not found" });
      }

      res.json({ organizations, pagination: { page, limit } });
    } catch (error) {
      console.error("Error in getOrganizationById:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getOrganizationsByUserId(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req?.user?.userId) {
        return res.status(404).json({ error: "Organizations not found" });
      }

      const { page, limit } = req.params;
      const organizations =
        await organizationService.getPaginatedOrganizationsByUserId(
          req.user.userId,
          Number(page),
          Number(limit)
        );

      if (!organizations) {
        return res.status(404).json({ error: "Organizations not found" });
      }

      res.json({ organizations, pagination: { page, limit } });
    } catch (error) {
      console.error("Error in getOrganizationById:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

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

  async createOrganization(req: AuthenticatedRequest, res: Response) {
    try {
      const newOrganizationData = req.body;
      console.log(req?.user)
      if (!req?.user) return;

      const newOrganization = await organizationService.createOrganization({
        ...newOrganizationData,
        admin: req?.user.userId,
        members: [req?.user.userId],
      });

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
      log.error("Error in addMemberToOrganization:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new OrganizationController();
