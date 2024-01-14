import {
  BillFrequency as PrismaBillFrequency,
  BillOption as PrismaBillOption,
  Plan as PrismaPlan,
} from "@prisma/client";
import { z } from "zod";

import { BillOptionModel, PlanModel } from "$/models";
import {
  Identifier,
  Serialized,
  getCreateSchema,
  getUpdateSchema,
} from "./shared";

export type BillFrequency = PrismaBillFrequency;
export const BillFrequency = PrismaBillFrequency;

const BillFrequencyValues = [
  BillFrequency.WEEKLY,
  BillFrequency.BIWEEKLY,
  BillFrequency.MONTHLY,
  BillFrequency.YEARLY,
] as const;

export const BillFrequencyLabels = {
  [BillFrequency.NEVER]: "Never (Free)",
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
export const billOptionCreateSchema = getCreateSchema(billOptionSchema).extend({
  serviceId: Identifier.optional(),
});
export const billOptionUpdateSchema = getUpdateSchema(billOptionSchema).omit({
  planId: true,
});

export type BillOptionUpdate = z.infer<typeof billOptionUpdateSchema>;
export type BillOptionCreate = z.infer<typeof billOptionCreateSchema>;

const planSchema = PlanModel;

const planIntervalCreateSchema = getCreateSchema(billOptionSchema);

export const planCreateSchema = getCreateSchema(planSchema).extend({
  billOptions: billOptionCreateSchema.omit({ planId: true }).array(),
});

export const planUpdateSchema = getUpdateSchema(planSchema).required({
  serviceId: true,
});

export type PlanCreate = z.infer<typeof planCreateSchema>;
export type PlanUpdate = z.infer<typeof planUpdateSchema>;
export type PlanIntervalCreate = z.infer<typeof planIntervalCreateSchema>;

export type BillOption = Serialized<PrismaBillOption>;
export type Plan = Serialized<PrismaPlan>;
export type PlanWithBillOptions = Plan & { billOptions: BillOption[] };
