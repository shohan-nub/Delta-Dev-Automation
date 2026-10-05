import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  customType,
} from "drizzle-orm/pg-core";
import { knowledge } from "./knowledge";

const vector = customType<{
  data: number[];
  driverData: string;
}>({
  dataType() {
    return "vector(768)";
  },

  toDriver(value) {
    return `[${value.join(",")}]`;
  },

  fromDriver(value) {
  return JSON.parse(value);
}
});

export const knowledgeChunks = pgTable("knowledge_chunks", {
  id: uuid("id").defaultRandom().primaryKey(),

  knowledgeId: uuid("knowledge_id")
    .notNull()
    .references(() => knowledge.id, {
      onDelete: "cascade",
    }),

  chunkIndex: integer("chunk_index").notNull(),

  content: text("content").notNull(),

  embedding: vector("embedding"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});