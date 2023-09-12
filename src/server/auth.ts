import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { prisma } from "./prisma";

export function unauthorized() {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  });
}

export async function withUser<K>(fn: (user: any) => K) {
  const session = await getServerSession();

  console.log("session", session);

  if (!session?.user) {
    throw unauthorized();
  }
  return fn(session!.user);
}

export async function authorized<K>(userId: number, fn: (user: any) => K) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    throw unauthorized();
  }

  const profile = await prisma.user.findUnique({
    where: {
      email: session.user.email || "",
    },
  });

  if (!profile || profile.id !== userId) {
    throw unauthorized();
  }

  return fn(session.user);
}
