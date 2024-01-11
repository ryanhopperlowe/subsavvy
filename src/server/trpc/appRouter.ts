import {
  billOptionRouter,
  planRouter,
  serviceRouter,
  userRouter,
} from "./routers";
import { router } from "./trpc";

export const appRouter = router({
  users: userRouter,
  services: serviceRouter,
  plans: planRouter,
  billOptions: billOptionRouter,
});

export type AppRouter = typeof appRouter;
