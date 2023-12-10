import { initTRPC } from "@trpc/server";
import { getAuthentication, prisma, unauthorized } from "..";

export const createContext = async () => {
  return { db: prisma };
};

const t = initTRPC.context<typeof createContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async (opts) => {
  const user = await getAuthentication();

  if (!user) {
    throw unauthorized();
  }

  return opts.next({
    ctx: { ...opts.ctx, user },
  });
});

export const authedProcedure = t.procedure.use(isAuthed);

export const authorizedProcedure = authedProcedure.use(async (opts) => {
  const profile = await prisma.user.findUnique({
    where: {
      email: opts.ctx.user.email || "",
    },
  });

  if (!profile) {
    throw unauthorized();
  }

  return opts.next({
    ctx: { ...opts.ctx, profile },
  });
});
