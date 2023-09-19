import { getAuthentication, prisma } from "@/server";
import { publicProcedure, router } from "../trpc";
import { serviceCreateSchema } from "@/model";

export const serviceRouter = router({
  getAll: publicProcedure.query(() =>
    prisma.service.findMany({
      include: {
        users: true,
      },
    })
  ),
  create: publicProcedure.input(serviceCreateSchema).mutation(async (opts) => {
    const user = await getAuthentication();

    const created = await prisma.service.create({
      data: {
        email: opts.input.email,
        name: opts.input.name,
        description: opts.input.description,
        owner: {
          connect: {
            email: user.email,
          },
        },
        users: {
          connect: opts.input.users.map((id) => ({ id })),
        },
        plans: {
          createMany: {
            data:
              opts.input.plans?.map((plan) => ({
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
        opts.input.plans?.map((plan) => ({
          planId: created.id,
          interval: plan.interval,
        })) || [],
    });

    return created;
  }),
});
