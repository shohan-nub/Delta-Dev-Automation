import { db } from "@/db";
import { orderItems } from "@/db/schema/order_items";
import { eq } from "drizzle-orm";

export class OrderItemsRepo {
  async getAll() {
    return await db.select().from(orderItems);
  }

  async getById(id: string) {
    const [item] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, id));

    return item;
  }

  async getByOrderId(orderId: string) {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async create(data: typeof orderItems.$inferInsert) {
    const [item] = await db
      .insert(orderItems)
      .values(data)
      .returning();

    return item;
  }

  async update(
    id: string,
    data: Partial<typeof orderItems.$inferInsert>
  ) {
    const [item] = await db
      .update(orderItems)
      .set(data)
      .where(eq(orderItems.id, id))
      .returning();

    return item;
  }

  async delete(id: string) {
    const [item] = await db
      .delete(orderItems)
      .where(eq(orderItems.id, id))
      .returning();

    return item;
  }
}

export const oirepo = new OrderItemsRepo();