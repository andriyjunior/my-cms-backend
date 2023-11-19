import { UserRoles } from "../enums/UserRoles";
import { log } from "../logs";
import Organization, { OrganizationModel } from "../models/organizationModel";
import { UserModel } from "../models/userModel";
import { generateRandomPassword } from "../utilities/passwordUtils";
import emailService from "./emailService";
import tokenService from "./tokenService";
import userService from "./userService";

class OrganizationService {
  async getOrganizationById(
    organizationId: string
  ): Promise<OrganizationModel | null> {
    // Implement logic to retrieve an organization by ID
    try {
      const organization = await Organization.findById(organizationId)
        .populate("members", "name") // Populate the members with only the name field
        .populate("products", "name") // Populate the products with only the name field
        .populate("orders", "orderNumber"); // Populate the orders with only the orderNumber field

      log.success("Organization has been found successfully");
      return organization;
    } catch (error) {
      log.error("Error fetching organization by ID:", error);
      return null;
    }
  }

  async createOrganization(
    newOrganization: Partial<OrganizationModel>
  ): Promise<OrganizationModel | null> {
    // Implement logic to create a new organization
    try {
      const organization = await Organization.create(newOrganization);
      log.success("Organization has been created successfully");
      return organization;
    } catch (error) {
      log.error("Error creating organization:", error);
      return null;
    }
  }

  async updateOrganization(
    organizationId: string,
    updatedOrganization: Partial<OrganizationModel>
  ): Promise<OrganizationModel | null> {
    // Implement logic to update organization information
    try {
      const organization = await Organization.findByIdAndUpdate(
        organizationId,
        updatedOrganization,
        {
          new: true,
        }
      );
      log.success("Organization has been updated successfully");
      return organization;
    } catch (error) {
      log.error("Error updating organization:", error);
      return null;
    }
  }

  async deleteOrganization(organizationId: string): Promise<boolean> {
    // Implement logic to delete an organization
    try {
      const result = await Organization.findByIdAndDelete(organizationId);
      log.success("Organization has been removed successfully");
      return result !== null;
    } catch (error) {
      log.error("Error deleting organization:", error);
      return false;
    }
  }

  async addMember(email: string, organizationId: string) {
    try {
      const password = generateRandomPassword(10);
      const newMember: Partial<UserModel> = {
        email,
        password,
        organizations: [organizationId],
        role: UserRoles.MANAGER,
      };

      const user = await userService.createUser(newMember);

      if (user) {
        const organization = await Organization.findByIdAndUpdate(
          organizationId,
          { $push: { members: user._id } },
          { new: true }
        );

        this.sendInvitationEmail(organization?._id, email, password);
      }
    } catch (error) {
      log.error("Error in addMember: ", error);
    }
  }

  async sendInvitationEmail(
    organizationId: string,
    memberEmail: string,
    password: string
  ): Promise<boolean> {
    try {
      const organization = await Organization.findById(organizationId);

      if (!organization) {
        log.error("Organization not found");
        return false;
      }

      await emailService.sendInvitationEmail(memberEmail, {
        email: memberEmail,
        password,
      });

      log.success("Invitation email sent successfully");
      return true;
    } catch (error) {
      log.error("Error sending invitation email:", error);
      return false;
    }
  }
}

export default new OrganizationService();
