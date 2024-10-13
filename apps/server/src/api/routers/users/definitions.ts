import { MESSAGES } from "@app/server/src/constants";
import { users } from "@app/server/src/database/schema";
import { paginationSchema } from "@app/server/src/lib/utils";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
); // Must contain at least one uppercase letter, one lowercase letter, one number, and one special character

export const userQuerySchema = paginationSchema.extend({
  username: z.string().optional(),
  orderBy: z.enum(["username"]).optional(),
});

export const userInsertSchema = createInsertSchema(users, {
  id: z.string().optional(),
  username: z
    .string({
      message: MESSAGES.string,
    })
    .min(2, MESSAGES.min(2))
    .max(50, MESSAGES.max(50)),
  email: z
    .string({
      message: MESSAGES.string,
    })
    .email(MESSAGES.email),
  role: z.enum(["user", "admin", "superadmin"]),
  password: z
    .string({
      message: MESSAGES.string,
    })
    .regex(passwordValidation, MESSAGES.password)
    .optional(),
}).pick({
  username: true,
  email: true,
  role: true,
  password: true,
});

export const userUpdateSchema = userInsertSchema
  .extend({
    id: z.string(),
  })
  .omit({
    password: true,
  });
