import { PrismaClient } from "@prisma/client";

import { BillOptionService } from "./BillOptionService";
import { PlanService } from "./PlanService";
import { ServiceService } from "./ServiceService";
import { UserService } from "./UserService";

export class AppService {
  users: UserService;
  services: ServiceService;
  plans: PlanService;
  billOptions: BillOptionService;

  constructor(db: PrismaClient) {
    this.users = new UserService(db);
    this.services = new ServiceService(db);
    this.plans = new PlanService(db);
    this.billOptions = new BillOptionService(db);
  }
}
