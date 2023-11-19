import { log } from "../logs";
import Product, { ProductModel } from "../models/productModel";

class ProductService {
  async getPaginatedProducts(
    page: number = 1,
    limit: number = 10
  ): Promise<ProductModel[]> {
    try {
      const skip = (page - 1) * limit;

      const products = await Product.find()
        .populate("category", "name")
        .populate("brand", "name")
        .skip(skip)
        .limit(limit);

      log.success(`Fetched ${products.length} products for page ${page}`);
      return products;
    } catch (error) {
      log.error("Error fetching paginated products:", error);
      return [];
    }
  }

  async getProductById(productId: string): Promise<ProductModel | null> {
    try {
      const product = await Product.findById(productId)
        .populate("category", "name") // Populate the category with only the name field
        .populate("brand", "name"); // Populate the brand with only the name field

      log.success("Product has been found successfully");
      return product;
    } catch (error) {
      log.error("Error fetching product by ID:", error);
      return null;
    }
  }

  async createProduct(
    newProduct: Partial<ProductModel>
  ): Promise<ProductModel | null> {
    try {
      const product = await Product.create(newProduct);
      log.success("Product has been created successfully");
      return product;
    } catch (error) {
      log.error("Error creating product:", error);
      return null;
    }
  }

  async updateProduct(
    productId: string,
    updatedProduct: Partial<ProductModel>
  ): Promise<ProductModel | null> {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        updatedProduct,
        {
          new: true,
        }
      );
      log.success("Product has been updated successfully");
      return product;
    } catch (error) {
      log.error("Error updating product:", error);
      return null;
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const result = await Product.findByIdAndDelete(productId);
      log.success("Product has been removed successfully");
      return result !== null;
    } catch (error) {
      log.error("Error deleting product:", error);
      return false;
    }
  }
}

export default new ProductService();
