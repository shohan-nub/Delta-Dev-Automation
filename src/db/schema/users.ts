import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  platform: varchar("platform", { length: 50 })
    .notNull(),

  puserId: varchar("puser_id", { length: 50 })
    .notNull(),

  name: varchar("name", { length: 100 }),

  username: varchar("username", { length: 100 }),

  firstSeen: timestamp("fseen")
    .defaultNow()
    .notNull(),

  lastSeen: timestamp("lseen")
    .defaultNow()
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});