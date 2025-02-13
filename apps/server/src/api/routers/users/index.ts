import {
  adminProcedure,
  createTRPCRouter,
  userProcedure,
} from "@server/api/trpc";
import { MESSAGES } from "@server/constants";
import { sessions, users, usersTenants } from "@server/database/schema";
import { hashPassword } from "@server/lib/auth";
import {
  idSchema,
  paginationMetaFactory,
  paramsSchema,
  resolvedQueryParams,
} from "@server/lib/utils";
import { TRPCError } from "@trpc/server";
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  not,
  sql,
} from "drizzle-orm";
import { nanoid } from "nanoid";
import postgres from "postgres";
import {
  userInsertSchema,
  userInviteSchema,
  userQuerySchema,
  userUpdateSchema,
} from "./definitions";

export const usersRouter = createTRPCRouter({
  list: adminProcedure.input(userQuerySchema).query(async ({ ctx, input }) => {
    const { page, limit, offset, orderBy, orderDir, username, email, role } =
      resolvedQueryParams(input);

    const records = await ctx.db.transaction((trx) => {
      return trx
        .select({
          ...getTableColumns(users),
          total: sql<number>`count(*) over ()`,
          role: usersTenants.role,
        })
        .from(users)
        .innerJoin(
          usersTenants,
          and(
            eq(usersTenants.userId, users.id),
            eq(usersTenants.tenantId, ctx.session.activeTenant.id),
          ),
        )
        .where((r) => {
          const args = [];
          if (username) args.push(ilike(r.username, `%${username}%`));
          if (email) args.push(ilike(r.email, `%${email}%`));
          if (role) args.push(ilike(usersTenants.role, `%${role}%`));

          args.push(
            inArray(
              users.id,
              trx
                .select({
                  id: usersTenants.userId,
                })
                .from(usersTenants)
                .where(() => {
                  const args = [];

                  // 👇 include only users that belong to the active tenant
                  args.push(
                    eq(usersTenants.tenantId, ctx.session.activeTenant.id),
                  );

                  // 👇 include only same and lower roles of the query owner
                  if (ctx.session.role === "user")
                    args.push(
                      not(inArray(usersTenants.role, ["admin", "superadmin"])),
                    );
                  if (ctx.session.role === "admin")
                    args.push(not(eq(usersTenants.role, "superadmin")));

                  return and(...args);
                }),
            ),
          );

          return and(...args);
        })
        .limit(limit)
        .offset(offset)
        .orderBy(() => {
          if (orderBy)
            return (orderDir === "asc" ? asc : desc)(
              {
                username: users.username,
                email: users.email,
                role: usersTenants.role,
              }[orderBy],
            );
          return desc(users.username);
        });
    });

    const total = records?.[0]?.total;

    return {
      records,
      meta: paginationMetaFactory({ total, page, limit }),
    };
  }),

  find: adminProcedure.input(paramsSchema).query(async ({ ctx, input }) => {
    const [res] = await ctx.db.transaction((trx) => {
      return trx
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          role: usersTenants.role,
        })
        .from(users)
        .innerJoin(
          usersTenants,
          and(
            eq(usersTenants.userId, users.id),
            eq(usersTenants.tenantId, ctx.session.activeTenant.id),
          ),
        )
        .where((r) => {
          const args = [];
          if (input.id) args.push(eq(r.id, input.id));

          args.push(
            inArray(
              users.id,
              trx
                .select({ id: usersTenants.userId })
                .from(usersTenants)
                .where(() => {
                  const args = [];

                  // 👇 include only users that belong to the active tenant
                  args.push(
                    eq(usersTenants.tenantId, ctx.session.activeTenant.id),
                  );

                  // 👇 include only same and lower roles of the query owner
                  if (ctx.session.role === "user")
                    args.push(
                      not(inArray(usersTenants.role, ["admin", "superadmin"])),
                    );
                  if (ctx.session.role === "admin")
                    args.push(not(eq(usersTenants.role, "superadmin")));

                  return and(...args);
                }),
            ),
          );

          return and(...args);
        })
        .execute();
    });

    if (!res)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: MESSAGES.notFound("User"),
      });

    return res;
  }),

  create: adminProcedure
    .input(userInsertSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const password = await hashPassword(input.password!);

        if (
          ctx.session.role === "admin" &&
          input.role !== "user" &&
          input.role !== "admin"
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Admins can only create users with roles 'user' or 'admin'.",
          });
        }

        return await ctx.db.transaction(async (trx) => {
          const [res] = await trx
            .insert(users)
            .values({
              username: input.username,
              email: input.email,
              password,
              activeTenantId: ctx.session.activeTenant.id,
            })
            .returning()
            .execute();

          await trx
            .insert(usersTenants)
            .values({
              userId: res.id,
              tenantId: ctx.session.activeTenant.id,
              role: input.role,
            })
            .returning()
            .execute();

          return { action: "insert", id: res.id };
        });
      } catch (err) {
        if (err instanceof postgres.PostgresError && err.code === "23505") {
          throw new TRPCError({
            code: "CONFLICT",
            message: MESSAGES.exists("user"),
          });
        }
        throw err;
      }
    }),

  update: adminProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (
        ctx.session.role === "admin" &&
        input.role !== "user" &&
        input.role !== "admin"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Admins can only update users with roles 'user' or 'admin'.",
        });
      }

      return await ctx.db.transaction(async (trx) => {
        const [res] = await trx
          .update(users)
          .set({
            username: input.username,
            email: input.email,
          })
          .where(eq(users.id, input.id))
          .returning()
          .execute();

        await trx
          .update(usersTenants)
          .set({
            role: input.role,
          })
          .where(
            and(
              eq(usersTenants.userId, input.id),
              eq(usersTenants.tenantId, ctx.session.activeTenant.id),
            ),
          )
          .returning()
          .execute();

        return { action: "update", id: res.id };
      });
    }),

  delete: adminProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(users).where(eq(users.id, input.id)).execute();
    return { action: "delete" };
  }),

  invite: adminProcedure
    .input(userInviteSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (trx) => {
        const [res] = await trx
          .selectDistinct({
            id: users.id,
          })
          .from(users)
          .where(eq(users.email, input.email))
          .execute();

        if (!res)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: MESSAGES.notFound("user"),
          });

        await trx
          .insert(usersTenants)
          .values({
            userId: res.id,
            tenantId: ctx.session.activeTenant.id,
            role: input.role,
          })
          .returning()
          .execute();

        return { action: "insert", id: res.id };
      });
    }),

  dismiss: adminProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    await ctx.db
      .delete(usersTenants)
      .where(
        and(
          eq(usersTenants.userId, input.id),
          eq(usersTenants.tenantId, ctx.session.activeTenant.id),
        ),
      )
      .execute();
    return { action: "delete" };
  }),

  resetPassword: adminProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const recoveryId = nanoid();
      const recoveryCode = await hashPassword(recoveryId);

      await ctx.db
        .update(users)
        .set({
          recoveryCode,
        })
        .where(eq(users.id, input.id))
        .returning()
        .execute();

      return { action: "update", recoveryId };
    }),

  activeUsers: userProcedure.query(async ({ ctx }) => {
    const activeUsers = await ctx.db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(users.activeTenantId, ctx.session.activeTenant.id))
      .groupBy(users.id)
      .orderBy(users.username)
      .execute();

    return activeUsers;
  }),
});
