import { adminProcedure, createTRPCRouter } from "@app/server/src/api/trpc";
import { MESSAGES } from "@app/server/src/constants";
import { users } from "@app/server/src/database/schema";
import {
  idSchema,
  paramsSchema,
  serializePaginationProps,
  serializeSearchParams,
} from "@app/server/src/lib/utils";
import { TRPCError } from "@trpc/server";
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  inArray,
  like,
  not,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { userInsertSchema, userQuerySchema } from "./definitions";

export const usersRouter = createTRPCRouter({
  list: adminProcedure.input(userQuerySchema).query(async ({ ctx, input }) => {
    const { page, limit, offset, orderBy, orderDir, ...rest } =
      serializeSearchParams(input);

    const records = await ctx.db
      .select({
        ...getTableColumns(users),
        total: sql<number>`count(*) over ()`,
      })
      .from(users)
      .where((r) => {
        const args = [];
        if (rest.username) args.push(like(r.username, `%${rest.username}%`));
        if (ctx.session.role === "user")
          args.push(not(inArray(r.role, ["admin", "superadmin"])));
        if (ctx.session.role === "admin")
          args.push(not(eq(r.role, "superadmin")));
        return and(...args);
      })
      .limit(limit)
      .offset(offset)
      .orderBy(() => {
        if (orderBy) return (orderDir === "asc" ? asc : desc)(users[orderBy]);
        return desc(users.id);
      });

    const total = records?.[0]?.total;

    return {
      records,
      ...serializePaginationProps({ total, page, limit }),
    };
  }),

  find: adminProcedure.input(paramsSchema).query(async ({ ctx, input }) => {
    const [res] = await ctx.db
      .select()
      .from(users)
      .where((r) => {
        const args = [];
        if (input.id) args.push(eq(r.id, input.id));
        if (ctx.session.role === "user")
          args.push(not(inArray(r.role, ["admin", "superadmin"])));
        if (ctx.session.role === "admin")
          args.push(not(eq(r.role, "superadmin")));
        return and(...args);
      })
      .execute();

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
      return await ctx.db
        .insert(users)
        .values(input)
        .returning()
        .execute()
        .then(([res]) => {
          return { action: "insert", id: res.id };
        })
        .catch((e) => {
          console.log("error is", e);
          if (e.code === "ER_DUP_ENTRY")
            throw new TRPCError({
              code: "CONFLICT",
              message: MESSAGES.exists("user"),
            });
          throw e;
        });
    }),

  update: adminProcedure
    .input(userInsertSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, input.id))
        .returning()
        .execute()
        .then(([res]) => {
          return { action: "update", id: res.id };
        })
        .catch((e) => {
          throw e;
        });
    }),

  delete: adminProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    await ctx.db
      .delete(users)
      .where(eq(users.id, input.id))
      .execute()
      .then(() => {
        return { action: "delete" };
      })
      .catch((e) => {
        throw e;
      });
  }),
});
