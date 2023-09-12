import { authorized, prisma, withUser } from "@/server";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    return prisma.user.findMany();
  }),
  getAuthed: publicProcedure.query(
    async () =>
      await withUser(async (user) => {
        return await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });
      })
  ),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        phone: z.string(),
        username: z.string(),
      })
    )
    .mutation(
      async (opts) =>
        await authorized(opts.input.id, async () =>
          prisma.user.update({
            where: {
              id: opts.input.id,
            },
            data: {
              name: opts.input.name,
              phone: opts.input.phone,
              username: opts.input.username,
            },
          })
        )
    ),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        username: z.string(),
      })
    )
    .mutation((opts) =>
      withUser(async (user) => {
        return prisma.user.create({
          data: {
            name: opts.input.name,
            email: user.email,
            phone: opts.input.phone,
            username: opts.input.username,
          },
        });
      })
    ),
  delete: publicProcedure.input(z.number()).mutation(async (opts) => {
    return prisma.user.delete({
      where: {
        id: opts.input,
      },
    });
  }),
});
