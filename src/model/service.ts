import { z } from "zod";

import { ServiceModel } from "$/models";
import { planCreateSchema } from "./plan";
import { getCreateSchema } from "./shared";

const serviceSchema = ServiceModel;

export const serviceCreateSchema = getCreateSchema(serviceSchema)
  .omit({ ownerId: true })
  .extend({
    users: z.array(z.number()),
    emailInvites: z.array(z.string().email()),
  });

export type Service = z.infer<typeof serviceSchema>;
export type ServiceCreate = z.infer<typeof serviceCreateSchema>;
