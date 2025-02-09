import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

const pgTable = t.pgTableCreator((name) => `${name}`);
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
  recoveryCode: t.varchar("recovery_code", { length: 512 }).default(""),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type SelectUserWithRole = SelectUser & {
  role: SelectUsersTenants["role"];
};
export type SelectPublicUser = Omit<
  SelectUser,
  "password" | "activeTenantId" | "recoveryCode" | "email"
>;
export type SelectPublicUserWithRole = SelectPublicUser & {
  role: SelectUsersTenants["role"];
};
type WithUser<T> = Omit<T, "createdBy" | "updatedBy"> & {
  createdBy: SelectPublicUser;
  updatedBy: SelectPublicUser;
};

export const sessions = pgTable("session", {
  id: t.text("id").primaryKey(),
  userId: t
    .text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: t.timestamp("expires", { mode: "date" }).notNull(),
});

export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;

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
