import { signIn, signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data, status } = useSession();

  const user = data?.user;
  const loading = status === "loading";
  const loggedIn = !!user;

  return {
    user,
    loading,
    loggedIn,
    login: () => signIn(),
    logout: () => signOut(),
  };
}
