import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import { orderItems } from "@/db/schema/order_items";
import { products } from "@/db/schema/products";
import { eq } from "drizzle-orm";

export class OrdersRepo {

  async getAll() {
    return await db
      .select()
      .from(orders);
  }

  async getById(id: string) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));

    return order;
  }

  async getOrderWithItems(id: string) {
    const result = await db
      .select({
        order: orders,
        item: orderItems,
        product: products,
      })
      .from(orders)
      .leftJoin(
        orderItems,
        eq(orderItems.orderId, orders.id)
      )
      .leftJoin(
        products,
        eq(products.id, orderItems.productId)
      )
      .where(eq(orders.id, id));

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].order,

      items: result
        .filter((row) => row.item !== null)
        .map((row) => ({
          ...row.item,
          product: row.product,
        })),
    };
  }

  async create(data: typeof orders.$inferInsert) {
    const [order] = await db
      .insert(orders)
      .values(data)
      .returning();

    return order;
  }

  async update(
    id: string,
    data: Partial<typeof orders.$inferInsert>
  ) {
    const [order] = await db
      .update(orders)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return order;
  }

  async delete(id: string) {
    const [order] = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning();

    return order;
  }
}

export const orepo = new OrdersRepo();