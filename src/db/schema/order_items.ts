import {
  pgTable,
  uuid,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

import { orders } from "./orders";
import { products } from "./products";

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),

  quantity: integer("quantity").notNull().default(1),

  unitPrice: numeric("unit_price", {
    precision: 12,
    scale: 2,
  }).notNull(),

  subtotal: numeric("subtotal", {
    precision: 12,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: false,
  })
    .defaultNow()
    .notNull(),
});