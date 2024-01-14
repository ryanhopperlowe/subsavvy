import { log } from "util";
import { z } from "zod";

import {
  Identifier,
  billOptionCreateSchema,
  planCreateSchema,
  planUpdateSchema,
} from "@/model";
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
      const canDeletePlan = ctx.dbs.plans.canEditPlan(input, ctx.profile.id);
      if (!canDeletePlan) throw unauthorized();

      return ctx.dbs.plans.delete(input);
    }),

  addBillOption: authorizedProcedure
    .input(billOptionCreateSchema.required({ planId: true }))
    .mutation(async ({ ctx, input }) => {
      console.log(input);

      const canEdit = await ctx.dbs.plans.canEditPlan(
        input.planId,
        ctx.profile.id,
      );

      if (!canEdit) throw unauthorized();

      return ctx.dbs.billOptions.create(input.planId, input);
    }),
});
