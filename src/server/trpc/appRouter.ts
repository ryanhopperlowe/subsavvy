import { z } from "zod";
import { router, publicProcedure } from "./trpc";
import prisma from "../prisma";
import { Session, getServerSession } from "next-auth";
import { TRPCError } from "@trpc/server";

function unauthorized() {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  });
}

async function withUser<K>(fn: (user: any) => K) {
  const session = await getServerSession();

  console.log("session", session);

  if (!session?.user) {
    throw unauthorized();
  }
  return fn(session!.user);
}

async function authorized<K>(userId: number, fn: (user: any) => K) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    throw unauthorized();
  }

  const profile = await prisma.user.findUnique({
    where: {
      email: session.user.email || "",
    },
  });

  if (!profile || profile.id !== userId) {
    throw unauthorized();
  }

  return fn(session!.user);
}

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return prisma.user.findMany();
  }),
  getAuthedUser: publicProcedure.query(
    async () =>
      await withUser(async (user) => {
        return await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });
      })
  ),
  updateUser: publicProcedure
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
  createUser: publicProcedure
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
  removeUser: publicProcedure.input(z.number()).mutation(async (opts) => {
    return prisma.user.delete({
      where: {
        id: opts.input,
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
