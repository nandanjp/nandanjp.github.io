import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schemas from "./schemas";
import * as relations from "./relations";

const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle({
    connection: env.DATABASE_URL,
    schema: { ...schemas, ...relations },
    casing: "camelCase",
});

export type DrizzleConnectionType = typeof db;
export type DrizzleTransactionType = Parameters<
    Parameters<DrizzleConnectionType["transaction"]>[0]
>[0];
