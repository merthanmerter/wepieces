import { MESSAGES } from "@app/server/src/constants";
import { users } from "@app/server/src/database/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const authLoginSchema = createInsertSchema(users, {
  id: z.string().optional(),
  username: z
    .string({
      message: MESSAGES.string,
    })
    .min(2, MESSAGES.min(2))
    .max(50, MESSAGES.max(50)),
  password: z.string({
    message: MESSAGES.string,
  }),
}).pick({
  id: true,
  username: true,
  password: true,
});
