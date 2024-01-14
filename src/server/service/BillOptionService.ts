import { BillOptionCreate, BillOptionUpdate, Identifier } from "@/model";

import { notFound } from "../auth";

import { RootService } from "./RootService";

export class BillOptionService extends RootService {
  async create(data: BillOptionCreate) {
    return this.db.billOption.create({ data });
  }

  async update({ id, ...data }: BillOptionUpdate) {
    return this.db.billOption.update({ where: { id }, data });
  }

  async delete(id: Identifier) {
    return this.db.billOption.delete({ where: { id } });
  }

  async canEdit(id: Identifier, userId: Identifier) {
    const billOption = await this.db.billOption.findUnique({
      where: { id },
      select: { plan: { select: { service: { select: { ownerId: true } } } } },
    });

    if (!billOption) throw notFound();

    return billOption.plan.service.ownerId === userId;
  }
}
