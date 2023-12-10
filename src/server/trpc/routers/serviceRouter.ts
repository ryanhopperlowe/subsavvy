import { prisma } from "@/server";
import { authedProcedure, publicProcedure, router } from "../trpc";
import { serviceCreateSchema } from "@/model";

export const serviceRouter = router({
  getAll: publicProcedure.query(() =>
    prisma.service.findMany({
      include: {
        users: true,
      },
    })
  ),
  create: authedProcedure
    .input(serviceCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const created = await prisma.service.create({
        data: {
          email: input.email,
          name: input.name,
          description: input.description,
          owner: {
            connect: {
              email: ctx.user.email,
            },
          },
          users: {
            connect: input.users.map((id) => ({ id })),
          },
          plans: {
            createMany: {
              data:
                input.plans?.map((plan) => ({
                  name: plan.name,
                  description: plan.description,
                  price: plan.price,
                })) || [],
            },
          },
        },
      });

      await prisma.planInterval.createMany({
        skipDuplicates: true,
        data:
          input.plans?.map((plan) => ({
            planId: created.id,
            interval: plan.interval,
          })) || [],
      });

      return created;
    }),
});
