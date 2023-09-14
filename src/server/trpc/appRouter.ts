import { router } from "./trpc";
import { clientRouter, userRouter } from "./routers";

export const appRouter = router({
  users: userRouter,
  clients: clientRouter,
});

export type AppRouter = typeof appRouter;
