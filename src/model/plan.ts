import { z } from "zod";
import { Interval as PrismaInterval, Prisma } from "@prisma/client";

export type Interval = PrismaInterval;
const PLAN_INTERVAL = PrismaInterval;

const PLAN_INTERVAL_VALUES = [
  PLAN_INTERVAL.WEEKLY,
  PLAN_INTERVAL.BIWEEKLY,
  PLAN_INTERVAL.MONTHLY,
  PLAN_INTERVAL.YEARLY,
] as const;

export const planCreate = z.object({
  currency: z.string().min(2).max(3),
  description: z.string().min(4).max(255),
  interval: z.enum(PLAN_INTERVAL_VALUES),
  name: z.string().min(4).max(22),
  price: z.number(),
  trialPeriodDays: z.number(),
});

export type Plan = Prisma.ClientSelect;
export type PlanCreate = z.infer<typeof planCreate>;
