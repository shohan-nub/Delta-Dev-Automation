import { oirepo } from "@/repositories/order_items.repository";
import { orderItems } from "@/db/schema/order_items";

export class OrderItemsService {
  async allItems() {
    return await oirepo.getAll();
  }

  async itemById(id: string) {
    return await oirepo.getById(id);
  }

  async itemsByOrderId(orderId: string) {
    return await oirepo.getByOrderId(orderId);
  }

  async createItem(
    data: typeof orderItems.$inferInsert
  ) {
    return await oirepo.create(data);
  }

  async updateItem(
    id: string,
    data: Partial<typeof orderItems.$inferInsert>
  ) {
    return await oirepo.update(id, data);
  }

  async deleteItem(id: string) {
    return await oirepo.delete(id);
  }
}

export const orderItemsService = new OrderItemsService();