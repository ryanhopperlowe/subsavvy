import { notFound } from "..";

import { BillOptionUpdate, Identifier } from "@/model";

import { RootService } from "./RootService";

export class BillOptionService extends RootService {
  async update({ id, ...data }: BillOptionUpdate) {
    return this.db.billOption.update({ where: { id }, data });
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
