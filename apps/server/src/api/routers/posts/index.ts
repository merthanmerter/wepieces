import {
  adminProcedure,
  createTRPCRouter,
  userProcedure,
} from "@app/server/src/api/trpc";
import { MESSAGES } from "@app/server/src/constants";
import { posts } from "@app/server/src/database/schema";
import {
  idSchema,
  paramsSchema,
  serializePaginationProps,
  serializeSearchParams,
} from "@app/server/src/lib/utils";
import { helpers } from "@app/utils";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, getTableColumns, like, sql } from "drizzle-orm";
import { userAlias } from "../../../database/utils";
import {
  postInsertSchema,
  postQuerySchema,
  postUpdateSchema,
} from "./definitions";

export const postsRouter = createTRPCRouter({
  list: userProcedure.input(postQuerySchema).query(async ({ ctx, input }) => {
    const { page, limit, offset, orderBy, orderDir, ...rest } =
      serializeSearchParams(input);

    const records = await ctx.db
      .select({
        ...getTableColumns(posts),
        total: sql<number>`count(*) over ()`,
      })
      .from(posts)
      .where((r) => {
        const args = [];
        if (rest.title) args.push(like(r.title, `%${rest.title}%`));
        if (rest.createdAt) {
          args.push(
            eq(
              sql`DATE(${r.createdAt})`,
              helpers.date(rest.createdAt!).toYYYYMMDD(),
            ),
          );
        }
        if (rest.updatedAt) {
          args.push(
            eq(
              sql`DATE(${r.updatedAt})`,
              helpers.date(rest.updatedAt!).toYYYYMMDD(),
            ),
          );
        }

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
      ...serializePaginationProps({ total, page, limit }),
    };
  }),

  find: userProcedure.input(paramsSchema).query(async ({ ctx, input }) => {
    const { alias, createdBy, updatedBy } = userAlias();

    const [res] = await ctx.db
      .select({
        ...getTableColumns(posts),
        createdBy: createdBy,
        updatedBy: updatedBy,
      })
      .from(posts)
      .innerJoin(alias.createdBy, eq(posts.createdBy, alias.createdBy.id))
      .innerJoin(alias.updatedBy, eq(posts.updatedBy, alias.updatedBy.id))
      .where(eq(posts.id, input.id))
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
});
