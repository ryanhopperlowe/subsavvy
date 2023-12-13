import { ServiceCreate } from "@/model";
import { RootService } from "./RootService";
import { Session } from "next-auth";

export class ServiceService extends RootService {
  async getAll() {
    return this.db.service.findMany({
      include: { users: true },
    });
  }

  async create(user: Session["user"], data: ServiceCreate) {
    return this.db.service.create({
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
      },
    });
  }
}
