import { urepo } from "@/repositories/users.repository";
import { users } from "@/db/schema/users";

export class UsersService {
  async allUsers() {
    return await urepo.getAll();
  }

  async userById(id: string) {
    return await urepo.getById(id);
  }

  async createUser(data: typeof users.$inferInsert) {
    return await urepo.create(data);
  }

  async updateUser(
    id: string,
    data: Partial<typeof users.$inferInsert>
  ) {
    return await urepo.update(id, data);
  }

  async deleteUser(id: string) {
    return await urepo.delete(id);
  }
}

export const userService = new UsersService();