import { createTRPCRouter, superAdminProcedure } from "@server/api/trpc";
import { MESSAGES } from "@server/constants";
import { tenants, usersTenants } from "@server/database/schema";
import {
  idSchema,
  paginationMetaFactory,
  paramsSchema,
  resolvedQueryParams,
} from "@server/lib/utils";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import postgres from "postgres";
import {
  tenantInsertSchema,
  tenantQuerySchema,
  tenantUpdateSchema,
} from "./definitions";

export const tenantsRouter = createTRPCRouter({
  list: superAdminProcedure
    .input(tenantQuerySchema)
    .query(async ({ ctx, input }) => {
      const { page, limit, offset, ...q } = resolvedQueryParams(input);

      const records = await ctx.db
        .select({
          ...getTableColumns(tenants),
          total: sql<number>`count(*) over ()`,
        })
        .from(tenants)
        .where((r) => {
          const args = [];
          if (q.name) args.push(ilike(r.name, `%${q.name}%`));
          if (q.status) args.push(eq(r.status, q.status));
          return and(...args);
        })
        .limit(limit)
        .offset(offset)
        .orderBy(() => {
          if (q.orderBy)
            return (q.orderDir === "asc" ? asc : desc)(tenants[q.orderBy]);
          return desc(tenants.id);
        });

      const total = records?.[0]?.total;

      return {
        records,
        meta: paginationMetaFactory({ total, page, limit }),
      };
    }),

  find: superAdminProcedure
    .input(paramsSchema)
    .query(async ({ ctx, input }) => {
      const [res] = await ctx.db
        .select({
          id: tenants.id,
          name: tenants.name,
          status: tenants.status,
        })
        .from(tenants)
        .where((r) => eq(r.id, input.id))
        .execute();

      if (!res)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: MESSAGES.notFound("Tenant"),
        });

      return res;
    }),

  create: superAdminProcedure
    .input(tenantInsertSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (trx) => {
        try {
          const [res] = await trx
            .insert(tenants)
            .values({
              name: input.name,
            })
            .returning()
            .execute();

          /* 👇 This method is to add only the current superadmin to the tenant
          await trx
            .insert(usersTenants)
            .values({
              tenantId: res.id,
              userId: ctx.session.id,
              role: "superadmin",
            })
            .returning()
            .execute();
          */

          // 👇 This method is to add all super admins to the tenant
          const superAdmins = await trx
            .select({
              id: usersTenants.userId,
            })
            .from(usersTenants)
            .where(eq(usersTenants.role, "superadmin"))
            .execute();

          await trx
            .insert(usersTenants)
            .values(
              superAdmins.map((superadmin) => ({
                tenantId: res.id,
                userId: superadmin.id,
                role: "superadmin" as const,
              })),
            )
            .execute();

          return { action: "insert", id: res.id };
        } catch (err) {
          trx.rollback();
          if (err instanceof postgres.PostgresError && err.code === "23505") {
            throw new TRPCError({
              code: "CONFLICT",
              message: MESSAGES.exists("tenant"),
            });
          }
          throw err;
        }
      });
    }),

  update: superAdminProcedure
    .input(tenantUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [res] = await ctx.db
        .update(tenants)
        .set({
          name: input.name,
          status: input.status,
        })
        .where(eq(tenants.id, input.id))
        .returning()
        .execute();

      return { action: "update", id: res.id };
    }),

  delete: superAdminProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(tenants).where(eq(tenants.id, input.id)).execute();
      return { action: "delete" };
    }),
});
