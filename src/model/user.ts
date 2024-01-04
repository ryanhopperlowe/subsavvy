import { z } from "zod";

import { UserModel } from "$/models";
import { getCreateSchema, getUpdateSchema } from "./shared";

export const userSchema = UserModel;
export const userUpdateSchema = getUpdateSchema(userSchema);
export const userCreateSchema = getCreateSchema(userSchema).omit({
  email: true,
});

export type User = z.infer<typeof userSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
