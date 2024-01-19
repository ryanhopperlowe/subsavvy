import { Session } from "next-auth";

import { Identifier, ServiceCreate } from "@/model";

import { RootService } from "./RootService";

export class ServiceService extends RootService {
  async getAll() {
    return this.db.service.findMany({
      include: { users: true },
    });
  }

  async getByUserId(userId: Identifier) {
    return this.db.service.findMany({
      where: { ownerId: userId },
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

  async getById(serviceId: Identifier) {
    return this.db.service.findUnique({
      where: { id: serviceId },
    });
  }

  async canEdit(serviceId: Identifier, userId: Identifier) {
    const service = await this.db.service.findUnique({
      where: { id: serviceId },
      select: { ownerId: true, users: { select: { id: true } } },
    });

    if (!service) return false;

    if (service.ownerId === userId) return true;

    return service.users.some((user) => user.id === userId);
  }

  async canDelete(serviceId: Identifier, userId: Identifier) {
    const service = await this.db.service.findUnique({
      where: { id: serviceId },
      select: { ownerId: true },
    });

    return service && service.ownerId === userId;
  }

  async canView(serviceId: Identifier, userId: Identifier) {
    const service = await this.db.service.findUnique({
      where: { id: serviceId },
      select: { ownerId: true, users: { select: { id: true } } },
    });

    if (!service) return false;

    if (service.ownerId === userId) return true;

    return service.users.some((user) => user.id === userId);
  }

  async deleteService(serviceId: Identifier) {
    return this.db.service.delete({ where: { id: serviceId } });
  }

  async inviteByEmail(serviceId: Identifier, emails: string[]) {
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
