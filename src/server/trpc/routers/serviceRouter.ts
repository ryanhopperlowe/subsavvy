import { authedProcedure, publicProcedure, router } from "../trpc";
import { serviceCreateSchema } from "@/model";

export const serviceRouter = router({
  getAll: publicProcedure.query(({ ctx }) => ctx.dbs.services.getAll()),
  create: authedProcedure
    .input(serviceCreateSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.dbs.services.create(ctx.user, input)
    ),
});
