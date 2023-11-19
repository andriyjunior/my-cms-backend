import { UserRoles } from "../enums/UserRoles";
import { User } from "../models/userModel";
import { UserService } from "./userService";

class SuperAdminService extends UserService {
  async createSuperAdmin(): Promise<void> {
    const adminExist = await User.findOne({ role: UserRoles.SYSTEM_ADMIN });

    if (adminExist) return;

    const data = {
      email: "admin@example.com",
      role: UserRoles.SYSTEM_ADMIN,
      password: "Password1,",
    };

    await this.createUser(data);
  }
}

export default new SuperAdminService();
