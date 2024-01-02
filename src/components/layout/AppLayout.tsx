"use client";
import { Box } from "@chakra-ui/react";
import { AppNav, AuthLayout } from "@/components";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <AppNav />
      <Box as="main" className="h-full py-2">
        {children}
      </Box>
    </AuthLayout>
  );
}
