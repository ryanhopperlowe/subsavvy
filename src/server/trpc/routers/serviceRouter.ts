import { z } from "zod";
import {
  authedProcedure,
  authorizedProcedure,
  publicProcedure,
  router,
} from "../trpc";
import { serviceCreateSchema } from "@/model";
import { notFound, unauthorized } from "@/server";

export const serviceRouter = router({
  getAll: publicProcedure.query(({ ctx }) => ctx.dbs.services.getAll()),
  getById: authorizedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const [service, canView] = await Promise.all([
        ctx.dbs.services.getById(input),
        ctx.dbs.services.canView(input, ctx.profile.id),
      ]);

      if (!service) throw notFound();
      if (!canView) throw unauthorized();

      return service;
    }),
  create: authedProcedure
    .input(serviceCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.dbs.services.create(ctx.user, input);

      await ctx.dbs.services.inviteByEmail(service.id, input.emailInvites);

      return service;
    }),
  delete: authorizedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const canDelete = await ctx.dbs.services.canDelete(input, ctx.profile.id);

      if (!canDelete) throw unauthorized();

      return ctx.dbs.services.deleteService(input);
    }),
});
