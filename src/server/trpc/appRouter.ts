import { z } from "zod";
import { router, publicProcedure } from "./trpc";
import prisma from "../prisma";

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return prisma.user.findMany();
  }),
  addUser: publicProcedure
    .input(
      z.object({
        name: z.string().nullable(),
        email: z.string().email(),
        phone: z.string(),
      })
    )
    .mutation(async (opts) => {
      return prisma.user.create({
        data: {
          name: opts.input.name,
          email: opts.input.email,
          phone: opts.input.phone,
        },
      });
    }),
  removeUser: publicProcedure.input(z.number()).mutation(async (opts) => {
    return prisma.user.delete({
      where: {
        id: opts.input,
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
