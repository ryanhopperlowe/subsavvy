import { useAuth } from "@/hooks";
import { trpc } from "@/lib";
import { Routes } from "@/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getUsers = trpc.users.getAll.useQuery();
  const getAuthedUser = trpc.users.getAuthed.useQuery(undefined, {
    enabled: false,
  });

  console.log(getUsers.data);

  console.log(getAuthedUser.data);

  useEffect(() => {
    if (!user) return;
    getAuthedUser.refetch();
  }, [user]);

  useEffect(() => {
    if (
      getAuthedUser.data ||
      getAuthedUser.isLoading ||
      pathname === Routes.updateProfile.path()
    )
      return;

    router.replace(Routes.updateProfile.path());
  }, [getAuthedUser.data, getAuthedUser.isLoading, pathname]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    router.push(Routes.login.path());
  }

  return <>{children}</>;
};
