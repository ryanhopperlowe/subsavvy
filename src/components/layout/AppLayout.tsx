"use client";

import { Box, Container } from "@chakra-ui/react";

import { AppNav, AuthLayout } from "@/components";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <Box className="flex flex-col">
        <AppNav />

        <Container as="main" className="h-full py-4 flex-1 overflow-auto">
          {children}
        </Container>
      </Box>
    </AuthLayout>
  );
}
