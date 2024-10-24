import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { MESSAGES } from "../../../constants";
import { todo } from "../../../database/schema";
import { paginationSchema } from "../../../lib/utils";

export const todoQuerySchema = paginationSchema.extend({
  type: z.enum(["personal", "team"]).optional(),
});

export const todoInsertSchema = createInsertSchema(todo, {
  title: z.string().min(3, MESSAGES.min(3)).max(100, MESSAGES.max(100)),
  type: z.enum(["personal", "team"]),
}).pick({
  title: true,
  type: true,
});

export const todoUpdateSchema = todoInsertSchema
  .extend({
    id: z.string(),
    completed: z.boolean(),
  })
  .omit({
    title: true,
    type: true,
  });
