import { z } from "zod";
import { BillFrequency as PrismaBillFrequency } from "@prisma/client";
import { BillOptionModel, PlanModel } from "$/models";

export type BillFrequency = PrismaBillFrequency;
const PlanInterval = PrismaBillFrequency;

const PLAN_INTERVAL_VALUES = [
  PlanInterval.WEEKLY,
  PlanInterval.BIWEEKLY,
  PlanInterval.MONTHLY,
  PlanInterval.YEARLY,
] as const;

const billOptionSchema = BillOptionModel;
const planSchema = PlanModel;

const planIntervalCreateSchema = billOptionSchema.omit({
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
    interval: billOptionSchema.shape.interval,
  });

export type Plan = z.infer<typeof planSchema>;
export type PlanCreate = z.infer<typeof planCreateSchema>;
export type PlanIntervalCreate = z.infer<typeof planIntervalCreateSchema>;
