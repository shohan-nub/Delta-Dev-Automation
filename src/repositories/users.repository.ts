import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export class UsersRepo {
  async getAll() {
    return await db.select().from(users);
  }

  async getById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user;
  }

  async create(data: typeof users.$inferInsert) {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning();

    return user;
  }

  async update(
    id: string,
    data: Partial<typeof users.$inferInsert>
  ) {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  async delete(id: string) {
    const [user] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return user;
  }
}

export const urepo = new UsersRepo();