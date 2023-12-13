import { z } from "zod";
import { planCreateSchema } from "./plan";
import { ServiceModel } from "$/models";

const serviceSchema = ServiceModel;

export const serviceCreateSchema = serviceSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    id: true,
    ownerId: true,
  })
  .extend({ users: z.array(z.number()) });

export type Service = z.infer<typeof serviceSchema>;
export type ServiceCreate = z.infer<typeof serviceCreateSchema>;
