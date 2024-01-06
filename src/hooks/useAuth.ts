"use client";

import { User } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { trpc } from "@/lib";
import { Routes } from "@/routes";

type OAuthUser = NonNullable<
  NonNullable<ReturnType<typeof useSession>["data"]>["user"]
>;

type AuthState<T extends boolean | undefined> = {
  loading: boolean;
  loggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  oauthUser: T extends true ? OAuthUser : OAuthUser | null;
  user: T extends true ? User : User | null;
};

export function useAuth<T extends boolean | undefined>({
  required = false as T,
}: {
  required?: T;
} = {}): AuthState<T> {
  const { data, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const oauthUser = data?.user;
  const loggedIn = !!oauthUser;

  const getProfile = trpc.users.getAuthed.useQuery(undefined, {
    enabled: loggedIn,
  });

  useEffect(() => {
    if (
      getProfile.data ||
      getProfile.isLoading ||
      pathname === Routes.updateProfile.path()
    )
      return;

    router.replace(Routes.updateProfile.path());
  }, [getProfile.data, getProfile.isLoading, pathname, router]);

  useEffect(() => {
    if (required && !loggedIn) {
      signIn();
    }
  }, [required, loggedIn]);

  const loading =
    status === "loading" ||
    (getProfile.isLoading && getProfile.fetchStatus !== "idle");

  return {
    oauthUser,
    loading,
    loggedIn,
    user: getProfile.data,
    login: () => signIn(),
    logout: () => signOut(),
  } as AuthState<T>;
}
