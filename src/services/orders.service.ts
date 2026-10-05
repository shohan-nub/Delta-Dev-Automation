import { orepo } from "@/repositories/orders.repository";
import { orders } from "@/db/schema/orders";

export class OrdersService {

  async allOrders() {
    return await orepo.getAll();
  }

  async orderById(id: string) {
    return await orepo.getById(id);
  }

  async orderWithItems(id: string) {
    return await orepo.getOrderWithItems(id);
  }

  async createOrder(
    data: typeof orders.$inferInsert
  ) {
    return await orepo.create(data);
  }

  async updateOrder(
    id: string,
    data: Partial<typeof orders.$inferInsert>
  ) {
    return await orepo.update(id, data);
  }

  async deleteOrder(id: string) {
    return await orepo.delete(id);
  }
}

export const orderService = new OrdersService();