import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-ignore TS7017
  if (!global.prisma) {
    // @ts-ignore TS7017
    global.prisma = new PrismaClient();
  }

  // @ts-ignore TS7017
  prisma = global.prisma;
}

export { prisma };
