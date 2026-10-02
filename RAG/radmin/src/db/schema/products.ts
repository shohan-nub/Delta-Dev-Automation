import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 80 }).notNull(),

  description: text("description").notNull(),

  category: varchar("category", { length: 90 }).notNull(),

  price: numeric("price", {
    precision: 12,
    scale: 2,
  }).notNull(),

  color: varchar("color", { length: 50 }).notNull(),

  size: text("size").array(),

  stock: integer("stock").notNull().default(0),

  imageUrl: text("imageUrl"),

  created_at: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  updated_at: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});