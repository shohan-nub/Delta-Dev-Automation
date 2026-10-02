import { db } from "@/db";
import { products } from "@/db/schema/products";
import { eq } from "drizzle-orm";

export class ProductRepo {
  async getAll() {
    return await db.select().from(products);
  }

  async create(data: typeof products.$inferInsert) {
    const [product] = await db
      .insert(products)
      .values(data)
      .returning();

    return product;
  }

  async getbyId(id: string) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    return product;
  }

  async delete(id: string) {
    const [product] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    return product;
  }

  async update(
    data: Partial<typeof products.$inferInsert>,
    id: string
  ) {
    const [product] = await db
      .update(products)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return product;
  }
}

export const prepo = new ProductRepo();