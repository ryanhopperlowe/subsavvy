import { Service as PrismaService } from "@prisma/client";
import { z } from "zod";

import { ServiceModel } from "$/models";
import { Identifier, Serialized, getCreateSchema } from "./shared";

const serviceSchema = ServiceModel;

export const serviceCreateSchema = getCreateSchema(serviceSchema)
  .omit({ ownerId: true })
  .extend({
    users: z.array(Identifier),
    emailInvites: z.array(z.string().email()),
  });

export type Service = Serialized<PrismaService>;
export type ServiceCreate = z.infer<typeof serviceCreateSchema>;
