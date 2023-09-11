import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

type OAuthUser = NonNullable<
  NonNullable<ReturnType<typeof useSession>["data"]>["user"]
>;

type AuthState<T extends boolean | undefined> = {
  loading: boolean;
  loggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  user: T extends true ? OAuthUser : OAuthUser | null;
};

export function useAuth<T extends boolean | undefined>({
  required = false as T,
}: {
  required?: T;
} = {}): AuthState<T> {
  const { data, status } = useSession();

  const user = data?.user;
  const loading = status === "loading";
  const loggedIn = !!user;

  useEffect(() => {
    if (required && !loggedIn) {
      signIn();
    }
  }, [required, loggedIn]);

  return {
    user,
    loading,
    loggedIn,
    login: () => signIn(),
    logout: () => signOut(),
  } as AuthState<T>;
}
