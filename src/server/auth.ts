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

  if (!session?.user) {
    throw unauthorized();
  }
  return fn(session.user);
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

export async function verifyAuthorization(userId: number) {
  const user = await getAuthentication();

  const profile = await prisma.user.findUnique({
    where: {
      email: user.email!,
    },
  });

  if (!profile || profile.id !== userId) {
    throw unauthorized();
  }

  return profile;
}
