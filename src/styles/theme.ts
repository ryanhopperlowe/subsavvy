import { extendTheme } from "@chakra-ui/react";

var theme = {
  colors: {
    black: "#000",
    white: "#fff",
    prim: {
      900: "#e6f7ff",
      800: "#bae7ff",
      700: "#91d5ff",
      600: "#69c0ff",
      500: "#40a9ff",
      400: "#1890ff",
      300: "#096dd9",
      200: "#0050b3",
      100: "#003a8c",
    },
    second: {
      // light seafoam green
      900: "#e6fffb",
      800: "#b5f5ec",
      700: "#87e8de",
      600: "#5cdbd3",
      500: "#36cfc9",
      400: "#13c2c2",
      300: "#08979c",
      200: "#006d75",
      100: "#00474f",
    },
    success: "#00FF00",
    error: "#FF0000",
    warning: "#FFFF00",
    info: "#00FFFF",
  },
};

var primary = theme.colors.prim;

var extras = {
  prim: {
    bg: primary[900],
    content: primary[100],
    bold: {
      bg: primary[700],
      content: primary[900],
    },
  },
  second: {
    bg: theme.colors.second[900],
    content: theme.colors.second[100],
    bold: {
      bg: theme.colors.second[700],
      content: theme.colors.second[900],
    },
  },
};

theme.colors.prim = {
  ...theme.colors.prim,
  ...extras.prim,
};

theme.colors.second = {
  ...theme.colors.second,
  ...extras.second,
};

export default extendTheme(theme);
