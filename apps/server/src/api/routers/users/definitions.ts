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
  email: z.string().optional(),
  role: z.enum(["user", "admin", "superadmin"]).optional(),
  orderBy: z.enum(["username", "email", "role"]).optional(),
});

export const userInsertSchema = createInsertSchema(users, {
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
  password: z
    .string({
      message: MESSAGES.string,
    })
    .regex(passwordValidation, MESSAGES.password),
})
  .extend({
    role: z.enum(["user", "admin", "superadmin"]),
  })
  .pick({
    username: true,
    email: true,
    role: true,
    password: true,
  });

export const userUpdateSchema = userInsertSchema
  .extend({
    id: z.string(),
    role: z.enum(["user", "admin", "superadmin"]),
  })
  .omit({
    password: true,
  });

export const userInviteSchema = userInsertSchema.pick({
  email: true,
  role: true,
});
