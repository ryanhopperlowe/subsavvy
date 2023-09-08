import { AppNav } from "@/components/client";
import { AuthLayout } from "./AuthLayout";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayout>
      <AppNav />
      <main>{children}</main>
    </AuthLayout>
  );
};
