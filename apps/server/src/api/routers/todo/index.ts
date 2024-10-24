import { and, desc, eq, getTableColumns } from "drizzle-orm";
import {
  adminProcedure,
  createTRPCRouter,
  userProcedure,
} from "../../../api/trpc";
import { todo } from "../../../database/schema";
import { idSchema } from "../../../lib/utils";
import {
  todoInsertSchema,
  todoQuerySchema,
  todoUpdateSchema,
} from "./definitions";

export const todoRouter = createTRPCRouter({
  list: userProcedure.input(todoQuerySchema).query(async ({ ctx, input }) => {
    const records = await ctx.db
      .select({
        ...getTableColumns(todo),
      })
      .from(todo)
      .where((r) => {
        const args = [];
        if (input.type === "personal") {
          args.push(
            and(eq(todo.createdBy, ctx.session.id), eq(todo.type, "personal")),
          );
        }
        if (input.type === "team") {
          args.push(and(eq(todo.type, "team")));
        }
        args.push(eq(r.tenantId, ctx.session.activeTenant.id));
        return and(...args);
      })
      .orderBy(() => desc(todo.createdAt));

    return records;
  }),

  add: userProcedure
    .input(todoInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [res] = await ctx.db
        .insert(todo)
        .values({
          title: input.title,
          type: input.type,
          completed: false,
          createdBy: ctx.session.id,
          updatedBy: ctx.session.id,
          tenantId: ctx.session.activeTenant.id,
        })
        .returning()
        .execute();

      return { action: "insert", id: res.id };
    }),

  complete: userProcedure
    .input(todoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [res] = await ctx.db
        .update(todo)
        .set({
          completed: input.completed,
        })
        .where(eq(todo.id, input.id))
        .returning()
        .execute();

      return { action: "update", id: res.id };
    }),

  delete: adminProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(todo).where(eq(todo.id, input.id)).execute();
    return { action: "delete" };
  }),
});
