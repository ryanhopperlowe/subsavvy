import { z } from "zod";
import { Prisma } from "@prisma/client";
import { planCreate } from "./plan";

export type Client = Prisma.ClientSelect;

export const clientCreateSchema = z.object({
  email: z.string().min(4).email(),
  name: z.string().min(4).max(22),
  description: z.string().min(4).max(255),
  users: z.array(z.number()),
  plans: z.array(planCreate).optional(),
});

export type ClientCreate = z.infer<typeof clientCreateSchema>;
