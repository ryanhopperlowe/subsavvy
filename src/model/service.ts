import { z } from "zod";
import { Prisma } from "@prisma/client";
import { planCreateSchema } from "./plan";
import { ServiceModel } from "$/models";

export type Service = Prisma.ServiceSelect;

const serviceSchema = ServiceModel;

export const serviceCreateSchema = serviceSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    id: true,
  })
  .extend({
    plans: z.array(planCreateSchema).optional(),
    users: z.array(z.number()),
  });

export type ServiceCreate = z.infer<typeof serviceCreateSchema>;
