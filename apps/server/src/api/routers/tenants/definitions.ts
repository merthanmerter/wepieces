import { MESSAGES } from "@app/server/src/constants";
import { tenants } from "@app/server/src/database/schema";
import { paginationSchema } from "@app/server/src/lib/utils";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tenantQuerySchema = paginationSchema.extend({
  name: z.string().optional(),
  status: z.enum(["active", "passive"]).optional(),
  orderBy: z.enum(["name"]).optional(),
});

export const tenantInsertSchema = createInsertSchema(tenants, {
  name: z
    .string({
      message: MESSAGES.string,
    })
    .min(2, MESSAGES.min(2))
    .max(50, MESSAGES.max(50)),
}).pick({
  name: true,
});

export const tenantUpdateSchema = tenantInsertSchema.extend({
  id: z.string(),
  status: z.enum(["active", "passive"]),
});
