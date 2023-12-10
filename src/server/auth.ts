import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { prisma } from "./prisma";

export function unauthorized() {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  });
}

type FullRequired<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export async function getAuthentication() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    throw unauthorized();
  }

  return session.user as FullRequired<typeof session.user>;
}
