import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";

export function unauthorized() {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  });
}

export function notFound() {
  return new TRPCError({
    code: "NOT_FOUND",
    message: "Not found",
  });
}

export function badRequest(message: string) {
  return new TRPCError({
    code: "BAD_REQUEST",
    message,
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
