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

  async getById(serviceId: number) {
    return this.db.service.findUnique({
      where: { id: serviceId },
      include: { users: true },
    });
  }

  async isEditAuthorized(serviceId: number, userId: number) {
    const service = await this.db.service.findUnique({
      where: { id: serviceId },
      select: { ownerId: true, users: { select: { id: true } } },
    });

    if (!service) return false;

    if (service.ownerId === userId) return true;

    return service.users.some((user) => user.id === userId);
  }

  async canDelete(serviceId: number, userId: number) {
    const service = await this.db.service.findUnique({
      where: { id: serviceId },
      select: { ownerId: true },
    });

    return service && service.ownerId === userId;
  }

  async deleteService(serviceId: number) {
    return this.db.service.delete({ where: { id: serviceId } });
  }

  async inviteByEmail(serviceId: number, emails: string[]) {
    const users = await this.db.user.findMany({
      where: { email: { in: emails } },
    });

    const userEmailMap = new Map(users.map((user) => [user.email, user.id]));

    return this.db.serviceUserInvites.createMany({
      data: emails.map((email) => ({
        userId: userEmailMap.get(email) ?? null,
        serviceId,
        email,
      })),
    });
  }
}
