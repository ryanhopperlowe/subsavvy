import {
  BillFrequency as PrismaBillFrequency,
  Plan as PrismaPlan,
} from "@prisma/client";
import { z } from "zod";

import { BillOptionModel, PlanModel } from "$/models";
import { Serialized, getCreateSchema, getUpdateSchema } from "./shared";

export type BillFrequency = PrismaBillFrequency;
export const BillFrequency = PrismaBillFrequency;

const BillFrequencyValues = [
  BillFrequency.WEEKLY,
  BillFrequency.BIWEEKLY,
  BillFrequency.MONTHLY,
  BillFrequency.YEARLY,
] as const;

export const BillFrequencyLabels = {
  [BillFrequency.ONE_TIME]: "One Time",
  [BillFrequency.WEEKLY]: "Weekly",
  [BillFrequency.BIWEEKLY]: "Biweekly",
  [BillFrequency.MONTHLY]: "Monthly",
  [BillFrequency.YEARLY]: "Yearly",
} as const;

export const BillFrequencyOptions = Object.values(BillFrequency).map(
  (value) => ({
    value,
    label: BillFrequencyLabels[value],
  }),
);

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

export const planUpdateSchema = getUpdateSchema(planSchema).required({
  serviceId: true,
});

export type Plan = Serialized<PrismaPlan>;
export type PlanCreate = z.infer<typeof planCreateSchema>;
export type PlanUpdate = z.infer<typeof planUpdateSchema>;
export type PlanIntervalCreate = z.infer<typeof planIntervalCreateSchema>;
