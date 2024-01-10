import { z } from "zod";

import { Identifier, planCreateSchema, planUpdateSchema } from "@/model";
import { notFound, unauthorized } from "@/server";

import { authorizedProcedure, router } from "../trpc";

export const planRouter = router({
  create: authorizedProcedure
    .input(planCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const canCreatePlan = await ctx.dbs.services.canEdit(
        input.serviceId,
        ctx.profile.id,
      );

      if (!canCreatePlan) throw unauthorized();

      return ctx.dbs.plans.create(input);
    }),

  getByServiceId: authorizedProcedure
    .input(Identifier)
    .query(async ({ ctx, input }) => {
      const canGetPlans = await ctx.dbs.services.canView(input, ctx.profile.id);

      if (!canGetPlans) throw unauthorized();

      return ctx.dbs.plans.getByServiceId(input);
    }),

  update: authorizedProcedure
    .input(planUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const canUpdatePlan = await ctx.dbs.services.canEdit(
        input.serviceId,
        ctx.profile.id,
      );

      if (!canUpdatePlan) throw unauthorized();

      return ctx.dbs.plans.update(input);
    }),

  delete: authorizedProcedure
    .input(Identifier)
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.dbs.plans.getById(input);

      if (!plan) throw notFound();

      const canDeletePlan = await ctx.dbs.services.canEdit(
        plan.serviceId,
        ctx.profile.id,
      );

      if (!canDeletePlan) throw unauthorized();

      return ctx.dbs.plans.delete(input);
    }),
});
