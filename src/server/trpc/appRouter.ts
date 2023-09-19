import { router } from "./trpc";
import { serviceRouter, userRouter } from "./routers";

export const appRouter = router({
  users: userRouter,
  services: serviceRouter,
});

export type AppRouter = typeof appRouter;
