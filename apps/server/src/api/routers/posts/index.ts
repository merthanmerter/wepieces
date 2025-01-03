import { TRPCError } from "@trpc/server";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  lt,
  sql,
} from "drizzle-orm";
import {
  adminProcedure,
  createTRPCRouter,
  userProcedure,
} from "../../../api/trpc";
import { MESSAGES } from "../../../constants";
import { posts } from "../../../database/schema";
import { usersAlias } from "../../../database/utils";
import {
  idSchema,
  paginationMetaFactory,
  paramsSchema,
  resolvedQueryParams,
} from "../../../lib/utils";
import {
  postInsertSchema,
  postQuerySchema,
  postReportQuerySchema,
  postUpdateSchema,
} from "./definitions";

export const postsRouter = createTRPCRouter({
  list: userProcedure.input(postQuerySchema).query(async ({ ctx, input }) => {
    const { page, limit, offset, orderBy, orderDir, ...rest } =
      resolvedQueryParams(input);

    const records = await ctx.db
      .select({
        ...getTableColumns(posts),
        total: sql<number>`count(*) over ()`,
      })
      .from(posts)
      .where((r) => {
        const args = [];
        if (rest.title) args.push(ilike(r.title, `%${rest.title}%`));
        args.push(eq(r.tenantId, ctx.session.activeTenant.id));
        return and(...args);
      })
      .limit(limit)
      .offset(offset)
      .orderBy(() => {
        if (orderBy) return (orderDir === "asc" ? asc : desc)(posts[orderBy]);
        return desc(posts.id);
      });

    const total = records?.[0]?.total;

    return {
      records,
      meta: paginationMetaFactory({ total, page, limit }),
    };
  }),

  find: userProcedure.input(paramsSchema).query(async ({ ctx, input }) => {
    const { users, createdBy, updatedBy } = usersAlias();

    const [res] = await ctx.db
      .select({
        ...getTableColumns(posts),
        createdBy,
        updatedBy,
      })
      .from(posts)
      .innerJoin(users.createdBy, eq(posts.createdBy, users.createdBy.id))
      .innerJoin(users.updatedBy, eq(posts.updatedBy, users.updatedBy.id))
      .where(
        and(
          eq(posts.id, input.id),
          eq(posts.tenantId, ctx.session.activeTenant.id),
        ),
      )
      .execute();

    if (!res)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: MESSAGES.notFound("Post"),
      });

    return res;
  }),

  create: userProcedure
    .input(postInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [res] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          createdBy: ctx.session.id,
          updatedBy: ctx.session.id,
          tenantId: ctx.session.activeTenant.id,
        })
        .returning()
        .execute();

      return { action: "insert", id: res.id };
    }),

  update: userProcedure
    .input(postUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [res] = await ctx.db
        .update(posts)
        .set({
          title: input.title,
          content: input.content,
          updatedBy: ctx.session.id,
        })
        .where(eq(posts.id, input.id))
        .returning()
        .execute();

      return { action: "update", id: res.id };
    }),

  delete: adminProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(posts).where(eq(posts.id, input.id)).execute();
    return { action: "delete" };
  }),

  chart: userProcedure
    .input(postReportQuerySchema)
    .query(async ({ ctx, input }) => {
      const { year, month } = input;
      return await ctx.db
        .select({
          day: sql<string>`DATE_TRUNC('day', ${posts.createdAt})`.as("day"),
          total: count(),
        })
        .from(posts)
        .where(
          and(
            eq(posts.tenantId, ctx.session.activeTenant.id),
            gte(posts.createdAt, new Date(year, month - 1, 1)), // Start of the month
            lt(posts.createdAt, new Date(year, month, 1)), // Start of the next month
          ),
        )
        .groupBy(sql`DATE_TRUNC('day', ${posts.createdAt})`)
        .orderBy(sql`DATE_TRUNC('day', ${posts.createdAt})`)
        .execute();
    }),
});
