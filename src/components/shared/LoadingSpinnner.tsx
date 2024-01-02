"use client";

import { Box, Spinner } from "@chakra-ui/react";

export function LoadingSpinner() {
  return (
    <Box className="h-full w-full flex justify-center">
      <Spinner />
    </Box>
  );
}
