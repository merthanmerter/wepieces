import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { MESSAGES } from "../../../constants";
import { posts } from "../../../database/schema";
import { paginationSchema } from "../../../lib/utils";

export const postQuerySchema = paginationSchema.extend({
  title: z.string().optional(),
  orderBy: z.enum(["title"]).optional(),
});

export const postInsertSchema = createInsertSchema(posts, {
  title: z.string().min(3, MESSAGES.min(3)),
  content: z.string().min(10, MESSAGES.min(10)),
}).pick({
  title: true,
  content: true,
});

export const postUpdateSchema = postInsertSchema
  .extend({
    id: z.string(),
  })
  .omit({});
