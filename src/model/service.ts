import { z } from "zod";
import { Prisma } from "@prisma/client";
import { planCreate } from "./plan";

export type Service = Prisma.ServiceSelect;

export const serviceCreateSchema = z.object({
  description: z.string().min(4).max(255),
  email: z.string().min(4).email(),
  name: z.string().min(4).max(22),
  plans: z.array(planCreate).optional(),
  users: z.array(z.number()),
  // leaving here just in case
  // owner: z.number(),
});

export type ServiceCreate = z.infer<typeof serviceCreateSchema>;
