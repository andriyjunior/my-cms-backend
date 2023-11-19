import { log } from "../logs";
import Brand, { BrandModel } from "../models/brandModel";

class BrandService {
  async getBrandById(brandId: string): Promise<BrandModel | null> {
    // Implement logic to retrieve a brand by ID
    try {
      const brand = await Brand.findById(brandId);
      log.success("Brand has been found successfully");
      return brand;
    } catch (error) {
      log.error("Error fetching brand by ID:", error);
      return null;
    }
  }

  async createBrand(newBrand: Partial<BrandModel>): Promise<BrandModel | null> {
    // Implement logic to create a new brand
    try {
      const brand = await Brand.create(newBrand);
      log.success("Brand has been created successfully");
      return brand;
    } catch (error) {
      log.error("Error creating brand:", error);
      return null;
    }
  }

  async updateBrand(
    brandId: string,
    updatedBrand: Partial<BrandModel>
  ): Promise<BrandModel | null> {
    // Implement logic to update brand information
    try {
      const brand = await Brand.findByIdAndUpdate(brandId, updatedBrand, {
        new: true,
      });
      log.success("Brand has been updated successfully");
      return brand;
    } catch (error) {
      log.error("Error updating brand:", error);
      return null;
    }
  }

  async deleteBrand(brandId: string): Promise<boolean> {
    // Implement logic to delete a brand
    try {
      const result = await Brand.findByIdAndDelete(brandId);
      log.success("Brand has been removed successfully");
      return result !== null;
    } catch (error) {
      log.error("Error deleting brand:", error);
      return false;
    }
  }
}

export default new BrandService();
