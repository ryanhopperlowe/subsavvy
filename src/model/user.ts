import { UserModel } from "$/models";
import { z } from "zod";

export const userSchema = UserModel;
export const userUpdateSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
  email: true,
});
export const userCreateSchema = userUpdateSchema.omit({
  id: true,
});

export type User = z.infer<typeof userSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
