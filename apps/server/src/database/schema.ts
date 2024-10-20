import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

const appName = "wepieces";
const pgTable = t.pgTableCreator((name) => `${appName}_${name}`);
export const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  20,
);
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
  tenantId: t
    .text("tenant")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
};

export const users = pgTable("users", {
  id: customId,
  username: t.varchar("username", { length: 255 }).unique().notNull(),
  email: t.varchar("email", { length: 255 }).unique().notNull(),
  password: t.varchar("password", { length: 512 }).notNull(),
  activeTenantId: t
    .text("active_tenant")
    .notNull()
    .references(() => tenants.id),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type SelectUserWithoutPassword = Omit<
  SelectUser,
  "password" | "activeTenantId"
> & { role: SelectUsersTenants["role"] };

export const tenants = pgTable("tenants", {
  id: customId,
  name: t.varchar("name", { length: 255 }).unique().notNull(),
  status: t
    .varchar("status", { enum: ["active", "passive"] })
    .default("active")
    .notNull(),
});

export type InsertTenant = typeof tenants.$inferInsert;
export type SelectTenant = typeof tenants.$inferSelect;

export const usersTenants = pgTable("users_tenants", {
  userId: t
    .text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tenantId: t
    .text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  role: t
    .varchar("role", { enum: ["user", "admin", "superadmin"] })
    .default("user")
    .notNull(),
});

export type InsertUsersTenants = typeof usersTenants.$inferInsert;
export type SelectUsersTenants = typeof usersTenants.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  usersTenants: many(usersTenants),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(usersTenants),
}));

export const userTenantsRelations = relations(usersTenants, ({ one }) => ({
  tenant: one(tenants, {
    fields: [usersTenants.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [usersTenants.userId],
    references: [users.id],
  }),
}));

export const posts = pgTable("posts", {
  ...baseSchema,
  title: t.text("title").notNull(),
  content: t.text("content").notNull(),
});

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
export type SelectPostWithUser = Omit<SelectPost, "createdBy" | "updatedBy"> & {
  createdBy: Omit<SelectUserWithoutPassword, "role">;
  updatedBy: Omit<SelectUserWithoutPassword, "role">;
};
