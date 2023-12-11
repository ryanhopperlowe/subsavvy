import { PrismaClient } from "@prisma/client";
import { UserService } from "./UserService";
import { ServiceService } from "./ServiceService";

export class AppService {
  users: UserService;
  services: ServiceService;

  constructor(db: PrismaClient) {
    this.users = new UserService(db);
    this.services = new ServiceService(db);
  }
}
