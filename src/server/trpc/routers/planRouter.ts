import { authorizedProcedure, router } from "..";

import { planCreateSchema } from "@/model";
import { unauthorized } from "@/server";

export const serviceRouter = router({
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
});
