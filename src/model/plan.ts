import { BillFrequency as PrismaBillFrequency } from "@prisma/client";
import { z } from "zod";

import { BillOptionModel, PlanModel } from "$/models";
import { getCreateSchema, getUpdateSchema } from "./shared";

export type BillFrequency = PrismaBillFrequency;
export const BillFrequency = PrismaBillFrequency;

const PLAN_INTERVAL_VALUES = [
  BillFrequency.WEEKLY,
  BillFrequency.BIWEEKLY,
  BillFrequency.MONTHLY,
  BillFrequency.YEARLY,
] as const;

const billOptionSchema = BillOptionModel;
const billOptionCreateSchema = getCreateSchema(billOptionSchema);
const billOptionUpdateSchema = getUpdateSchema(billOptionSchema).omit({
  planId: true,
});

const planSchema = PlanModel;

const planIntervalCreateSchema = getCreateSchema(billOptionSchema);

export const planCreateSchema = getCreateSchema(planSchema).extend({
  billOptions: billOptionCreateSchema.omit({ planId: true }).array(),
});

export const planUpdateSchema = getUpdateSchema(planSchema).extend({
  billOptions: billOptionUpdateSchema.array().optional(),
});

export type Plan = z.infer<typeof planSchema>;
export type PlanCreate = z.infer<typeof planCreateSchema>;
export type PlanIntervalCreate = z.infer<typeof planIntervalCreateSchema>;
