import { log } from "../logs";
import { User, UserModel } from "../models/userModel";
import { hashPassword, comparePasswords } from "../utilities/passwordUtils";
import TokenService from "./tokenService";

class UserService {
  async getUserById(decodedUserId: string): Promise<UserModel | null> {
    try {
      const user = await User.findById(decodedUserId);
      log.success("User has been found successfully");
      return user;
    } catch (error) {
      log.error("Error fetching user by ID:", error);
      return null;
    }
  }

  async createUser(newUser: Partial<UserModel>): Promise<UserModel | null> {
    try {
      newUser.password = await hashPassword(newUser.password!);
      const user = await User.create(newUser);
      log.success(user.role, " has been saved successfully");
      return user;
    } catch (error: any) {
      if (error?.code === 11000 && error.keyPattern?.username === 1) {
        throw Error("Username is already taken");
      }

      log.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(
    userId: string,
    updatedUser: Partial<UserModel>
  ): Promise<UserModel | null> {
    try {
      const user = await User.findByIdAndUpdate(userId, updatedUser, {
        new: true,
      });
      log.success("User has been updated successfully");
      return user;
    } catch (error) {
      log.error("Error updating user:", error);
      return null;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(userId);
      log.success("User has been removed successfully");
      return result !== null;
    } catch (error) {
      log.error("Error deleting user:", error);
      return false;
    }
  }

  async addOrganizationToUser(
    userId: string,
    organizationId: string
  ): Promise<UserModel | null> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        log.error("User not found");
        return null;
      }

      if (user.organizations?.includes(organizationId)) {
        log.error("User is already associated with this organization");
        return user;
      }

      user.organizations?.push(organizationId);

      const updatedUser = await user.save();
      log.success("Organization added to user successfully");
      return updatedUser;
    } catch (error) {
      log.error("Error adding organization to user:", error);
      return null;
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null> {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return null;
      }

      const isPasswordValid = await comparePasswords(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      const expiresIn = TokenService.getExpiresIn();
      const accessToken = TokenService.generateAccessToken(user._id);
      const refreshToken = TokenService.generateRefreshToken(user._id);

      return { accessToken, refreshToken, expiresIn };
    } catch (error) {
      log.error("Error during login:", error);
      return null;
    }
  }
}

export { UserService };
export default new UserService();
