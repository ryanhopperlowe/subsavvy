import { ServiceCreate } from "@/model";
import { RootService } from "./RootService";
import { Session } from "next-auth";
import { useReducedMotion } from "framer-motion";

export class ServiceService extends RootService {
  async getAll() {
    return this.db.service.findMany({
      include: { users: true },
    });
  }

  async create(user: Session["user"], data: ServiceCreate) {
    const created = await this.db.service.create({
      data: {
        email: data.email,
        name: data.name,
        description: data.description,
        owner: {
          connect: { email: user.email },
        },
        users: {
          connect: data.users.map((id) => ({ id })),
        },
        plans: {
          createMany: {
            data:
              data.plans?.map((plan) => ({
                name: plan.name,
                description: plan.description,
              })) || [],
          },
        },
      },
    });

    await this.db.planInterval.createMany({
      skipDuplicates: true,
      data:
        data.plans?.map((plan) => ({
          planId: created.id,
          interval: plan.interval,
        })) || [],
    });

    return created;
  }
}
