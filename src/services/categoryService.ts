import { log } from "../logs";
import Category, { CategoryModel } from "../models/categoryModel";

class CategoryService {
  async getCategoryById(categoryId: string): Promise<CategoryModel | null> {
    // Implement logic to retrieve a category by ID
    try {
      const category = await Category.findById(categoryId);
      log.success("Category has been found successfully");
      return category;
    } catch (error) {
      log.error("Error fetching category by ID:", error);
      return null;
    }
  }

  async createCategory(
    newCategory: Partial<CategoryModel>
  ): Promise<CategoryModel | null> {
    // Implement logic to create a new category
    try {
      const category = await Category.create(newCategory);
      log.success("Category has been created successfully");
      return category;
    } catch (error) {
      log.error("Error creating category:", error);
      return null;
    }
  }

  async updateCategory(
    categoryId: string,
    updatedCategory: Partial<CategoryModel>
  ): Promise<CategoryModel | null> {
    // Implement logic to update category information
    try {
      const category = await Category.findByIdAndUpdate(
        categoryId,
        updatedCategory,
        {
          new: true,
        }
      );
      log.success("Category has been updated successfully");
      return category;
    } catch (error) {
      log.error("Error updating category:", error);
      return null;
    }
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    // Implement logic to delete a category
    try {
      const result = await Category.findByIdAndDelete(categoryId);
      log.success("Category has been removed successfully");
      return result !== null;
    } catch (error) {
      log.error("Error deleting category:", error);
      return false;
    }
  }
}

export default new CategoryService();
