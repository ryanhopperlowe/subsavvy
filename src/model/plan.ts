import { z } from "zod";
import { Interval as PrismaInterval, Prisma } from "@prisma/client";
import { PlanIntervalModel, PlanModel } from "$/models";

export type PlanInterval = PrismaInterval;
const PlanInterval = PrismaInterval;

const PLAN_INTERVAL_VALUES = [
  PlanInterval.WEEKLY,
  PlanInterval.BIWEEKLY,
  PlanInterval.MONTHLY,
  PlanInterval.YEARLY,
] as const;

const planIntervalSchema = PlanIntervalModel;
const planSchema = PlanModel;

const planIntervalCreateSchema = planIntervalSchema.omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

export const planCreateSchema = planSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    id: true,
  })
  .extend({
    interval: planIntervalSchema.shape.interval,
  });

export type Plan = z.infer<typeof planSchema>;
export type PlanCreate = z.infer<typeof planCreateSchema>;
export type PlanIntervalCreate = z.infer<typeof planIntervalCreateSchema>;
