import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"


const connection= process.env.DATABASE_URL!;
const client=postgres(connection);
export const db=drizzle(client);
