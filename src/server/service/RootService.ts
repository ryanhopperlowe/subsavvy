import { PrismaClient } from "@prisma/client";

export class RootService {
  constructor(protected db: PrismaClient) {}
}
