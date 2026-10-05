import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  customerName: varchar("customer_name", { length: 80 }).notNull(),

  phone: varchar("phone", { length: 30 }).notNull(),

  address: varchar("address").notNull(),

  paymentMethod: varchar("payment_method", { length: 30 })
    .notNull()
    .default("cod"),

  paymentStatus: varchar("payment_status", { length: 30 })
    .notNull()
    .default("pending"),

  orderStatus: varchar("order_status", { length: 30 })
    .notNull()
    .default("pending"),

  totalAmount: numeric("total_amount", {
    precision: 12,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: false,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: false,
  })
    .defaultNow()
    .notNull(),
});