import { Identifier, PlanCreate, PlanUpdate } from "@/model";

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
}
