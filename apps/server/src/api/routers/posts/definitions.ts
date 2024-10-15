import { posts } from "@app/server/src/database/schema";
import { paginationSchema } from "@app/server/src/lib/utils";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const postQuerySchema = paginationSchema.extend({
  title: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  orderBy: z.enum(["title", "createdAt", "updatedAt"]).optional(),
});

export const postInsertSchema = createInsertSchema(posts, {
  id: z.string().optional(),
}).pick({
  title: true,
  content: true,
});

export const postUpdateSchema = postInsertSchema
  .extend({
    id: z.string(),
  })
  .omit({});
