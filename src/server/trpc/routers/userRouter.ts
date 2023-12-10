import { authorizedProcedure } from "./../trpc";
import { prisma, unauthorized } from "@/server";
import { authedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    return prisma.user.findMany();
  }),
  getAuthed: authedProcedure.query(
    async ({ ctx }) =>
      await ctx.db.user.findUnique({
        where: {
          email: ctx.user.email,
        },
      })
  ),
  update: authorizedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        phone: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      authorize(input.id, ctx.profile.id);

      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          phone: input.phone,
          username: input.username,
        },
      });
    }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        username: z.string(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.user.create({
        data: {
          name: input.name,
          email: ctx.user.email,
          phone: input.phone,
          username: input.username,
        },
      })
    ),
  delete: authorizedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      authorize(input, ctx.profile.id);

      return ctx.db.user.delete({
        where: {
          id: input,
        },
      });
    }),
});

function authorize(input: number, profileId?: number) {
  if (profileId !== input) {
    throw unauthorized();
  }
}
