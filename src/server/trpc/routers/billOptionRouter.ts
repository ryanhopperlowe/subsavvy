import { Identifier, billOptionUpdateSchema } from "@/model";
import { unauthorized } from "@/server";

import { authorizedProcedure, router } from "../trpc";

export const billOptionRouter = router({
  update: authorizedProcedure
    .input(billOptionUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const canEdit = await ctx.dbs.billOptions.canEdit(
        input.id,
        ctx.profile.id,
      );

      if (!canEdit) throw unauthorized();

      return ctx.dbs.billOptions.update(input);
    }),

  delete: authorizedProcedure
    .input(Identifier)
    .mutation(async ({ input, ctx }) => {
      const canEdit = await ctx.dbs.billOptions.canEdit(input, ctx.profile.id);

      if (!canEdit) throw unauthorized();

      return ctx.dbs.billOptions.delete(input);
    }),
});
