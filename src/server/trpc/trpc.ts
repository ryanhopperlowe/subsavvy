import { getAuthentication, prisma, unauthorized } from "..";
import { initTRPC } from "@trpc/server";

import { AppService } from "../service";

export const createContext = async () => {
  return { db: prisma, dbs: new AppService(prisma) };
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

  if (process.env.NODE_ENV === "development") {
    // wait 2 seconds to simulate a slow connection
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (!profile) {
    throw unauthorized();
  }

  return opts.next({
    ctx: { ...opts.ctx, profile },
  });
});
