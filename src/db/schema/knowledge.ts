
import { uuid } from "drizzle-orm/pg-core";
import { pgTable ,text,varchar,timestamp} from "drizzle-orm/pg-core";


export const knowledge=pgTable("knowledge",{
    id:uuid("id").defaultRandom().primaryKey(),
    title:varchar("title",{length:200}).notNull(),
    content:text("content").notNull(),
    created_at:timestamp("created_at",{withTimezone:true}).defaultNow().notNull(),
    updated_at:timestamp("updated_at",{withTimezone:true}).defaultNow().notNull()

});