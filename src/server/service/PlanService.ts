import { PlanCreate } from "@/model";

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
}
