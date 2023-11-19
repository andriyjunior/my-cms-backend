// services/OrderService.ts
import { log } from "../logs";
import Order, { OrderModel } from "../models/orderModel";

class OrderService {
  async createOrder(
    orderData: Partial<OrderModel>
  ): Promise<OrderModel | null> {
    try {
      const order = await Order.create(orderData);
      log.success("Order has been created successfully");
      return order;
    } catch (error) {
      log.error("Error creating order:", error);
      return null;
    }
  }

  async getOrderById(orderId: string): Promise<OrderModel | null> {
    try {
      const order = await Order.findById(orderId).populate(
        "items.product",
        "name price"
      );
      log.success("Order has been found successfully");
      return order;
    } catch (error) {
      log.error("Error fetching order by ID:", error);
      return null;
    }
  }

  // Add methods for updating and deleting orders...

  async getOrdersByUser(userId: string): Promise<OrderModel[]> {
    try {
      const orders = await Order.find({ user: userId })
        .populate("items.product", "name price")
        .sort({ createdAt: -1 }); // Sort by creation date in descending order
      log.success(`Fetched ${orders.length} orders for user ${userId}`);
      return orders;
    } catch (error) {
      log.error("Error fetching orders by user:", error);
      return [];
    }
  }
}

export default new OrderService();
