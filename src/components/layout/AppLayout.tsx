"use client";

import { Container } from "@chakra-ui/react";

import { AppNav, AuthLayout } from "@/components";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <AppNav />

      <Container as="main" className="h-full py-2">
        {children}
      </Container>
    </AuthLayout>
  );
}
