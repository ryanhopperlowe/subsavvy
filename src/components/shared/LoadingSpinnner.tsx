"use client";

import { Box, Spinner } from "@chakra-ui/react";
import cn from "classnames";
import { ComponentProps } from "react";

export function LoadingSpinner({
  inline,
  size,
}: {
  inline?: boolean;
  size?: ComponentProps<typeof Spinner>["size"];
}) {
  if (inline) return <Spinner size={size} alignSelf="center" />;

  return (
    <Box className={cn("h-full w-full flex justify-center")}>
      <Spinner size={size} />
    </Box>
  );
}
