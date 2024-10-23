import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { MESSAGES } from "../../../constants";
import { users } from "../../../database/schema";
import { passwordValidation } from "../users/definitions";

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

export const authLogoutSchema = z.object({
  allDevices: z.boolean().optional().default(false),
});
export const recoverAccountSchema = createInsertSchema(users, {
  username: z.string().min(2, MESSAGES.min(2)).max(50, MESSAGES.max(50)),
  password: z
    .string({
      message: MESSAGES.string,
    })
    .regex(passwordValidation, MESSAGES.password),
})
  .extend({
    recoveryCode: z.string().min(2, MESSAGES.min(10)).max(50, MESSAGES.max(50)), // not null
    confirmPassword: z
      .string({
        message: MESSAGES.string,
      })
      .regex(passwordValidation, MESSAGES.password),
  })
  .pick({
    username: true,
    recoveryCode: true,
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
