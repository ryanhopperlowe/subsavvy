import { Identifier, PlanCreate, PlanUpdate } from "@/model";

import { notFound } from "../auth";

import { RootService } from "./RootService";

export class PlanService extends RootService {
  create({ billOptions, ...data }: PlanCreate) {
    return this.db.plan.create({
      data: {
        ...data,
        billOptions: { createMany: { data: billOptions } },
      },
    });
  }

  getById(id: Identifier) {
    return this.db.plan.findUnique({ where: { id } });
  }

  getByServiceId(serviceId: Identifier) {
    return this.db.plan.findMany({
      where: { serviceId },
      include: { billOptions: true },
    });
  }

  update({ id, ...data }: PlanUpdate) {
    return this.db.plan.update({
      where: { id },
      data,
    });
  }

  delete(id: Identifier) {
    return this.db.plan.delete({ where: { id } });
  }

  async canEditPlan(planId: Identifier, userId: Identifier) {
    const response = await this.db.plan.findUnique({
      where: { id: planId },
      select: { service: { select: { ownerId: true } } },
    });

    if (!response) throw notFound("Plan");

    return response.service.ownerId === userId;
  }
}
