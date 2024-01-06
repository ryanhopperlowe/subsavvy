import { planRouter, serviceRouter, userRouter } from "./routers";
import { router } from "./trpc";

export const appRouter = router({
  users: userRouter,
  services: serviceRouter,
  plans: planRouter,
});

export type AppRouter = typeof appRouter;
