import { BillFrequency as PrismaBillFrequency } from "@prisma/client";
import { z } from "zod";

import { BillOptionModel, PlanModel } from "$/models";
import { getCreateSchema } from "./shared";

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

const planIntervalCreateSchema = getCreateSchema(billOptionSchema);

export const planCreateSchema = getCreateSchema(planSchema).extend({
  interval: billOptionSchema.shape.interval,
});

export type Plan = z.infer<typeof planSchema>;
export type PlanCreate = z.infer<typeof planCreateSchema>;
export type PlanIntervalCreate = z.infer<typeof planIntervalCreateSchema>;
