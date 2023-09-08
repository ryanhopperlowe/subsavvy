import { AppServiceProvider } from "@/lib";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider>
        <AppServiceProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppServiceProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
