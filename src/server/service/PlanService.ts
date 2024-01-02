import { PlanCreate } from "@/model";

import { RootService } from "./RootService";

export class PlanService extends RootService {
  create(data: PlanCreate) {
    return this.db.plan.create({ data });
  }
}
