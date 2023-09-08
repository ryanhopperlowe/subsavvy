import { useAuth } from "@/hooks";
import { Routes } from "@/routes";
import { useRouter } from "next/navigation";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

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
