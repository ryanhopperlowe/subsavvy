import { Plan } from "./../../../model/plan";
import { prisma } from "@/server";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clientCreateSchema } from "@/model";

export const clientRouter = router({
  getAll: publicProcedure.query(() => prisma.client.findMany()),
  create: publicProcedure.input(clientCreateSchema).mutation(async (opts) => {
    const created = await prisma.client.create({
      data: {
        email: opts.input.email,
        name: opts.input.name,
        description: opts.input.description,
        Users: {
          connect: opts.input.users.map((id) => ({ id })),
        },
        Plans: {
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
