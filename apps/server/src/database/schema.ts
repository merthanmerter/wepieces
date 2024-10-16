import * as t from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

const appName = "wepieces";
const pgTable = t.pgTableCreator((name) => `${appName}_${name}`);
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 20);
const customId = t
  .varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => nanoid());

export const baseSchema = {
  id: customId,
  createdBy: t
    .text("created_by")
    .references(() => users.id)
    .notNull(),
  updatedBy: t
    .text("updated_by")
    .references(() => users.id)
    .notNull(),
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
  updatedAt: t
    .timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: customId,
  username: t.varchar("username", { length: 255 }).notNull(),
  email: t.varchar("email", { length: 255 }).notNull().unique(),
  role: t
    .varchar("role", { enum: ["user", "admin", "superadmin"] })
    .default("user")
    .notNull(),
  password: t.varchar("password", { length: 512 }).notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type SelectUserWithoutPassword = Omit<SelectUser, "password">;

export const posts = pgTable("posts", {
  ...baseSchema,
  title: t.text("title").notNull(),
  content: t.text("content").notNull(),
});

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
export type SelectPostWithUser = Omit<SelectPost, "createdBy" | "updatedBy"> & {
  createdBy: SelectUserWithoutPassword;
  updatedBy: SelectUserWithoutPassword;
};
