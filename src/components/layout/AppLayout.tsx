import { AppNav } from "@/components/client";
import { AuthLayout } from "./AuthLayout";
import { Box } from "@chakra-ui/react";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayout>
      <AppNav />
      <Box as="main" className="h-full py-2">
        {children}
      </Box>
    </AuthLayout>
  );
};
