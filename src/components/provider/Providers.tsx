"use client";

import { AppServiceProvider } from "@/lib";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { theme } from "@/styles";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <AppServiceProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppServiceProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
