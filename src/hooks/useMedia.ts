import { useMediaQuery } from "@chakra-ui/react";

import { MediaBreakpoints } from "@/constants";

export function useMedia() {
  const [isSm, isMd, isLg, isXl, isXxl] = useMediaQuery([
    `(min-width: ${MediaBreakpoints.sm})`,
    `(min-width: ${MediaBreakpoints.md})`,
    `(min-width: ${MediaBreakpoints.lg})`,
    `(min-width: ${MediaBreakpoints.xl})`,
    `(min-width: ${MediaBreakpoints.xxl})`,
  ]);

  return {
    isXs: !isSm,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
  };
}
