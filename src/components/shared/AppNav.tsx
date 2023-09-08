import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "@/hooks";
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  IconButton,
  Link,
  List,
  ListItem,
  Spacer,
  SystemStyleObject,
} from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";
import { Routes } from "@/routes";
import { usePathname, useRouter } from "next/navigation";

export const AppNav = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      as="nav"
      bgColor="blue.400"
      color="blue.100"
      className="flex align-middle p-4 gap-4"
    >
      <IconButton
        as="button"
        onClick={() => setIsOpen(true)}
        aria-label="menu"
        sx={{
          color: "blue.100",
          _hover: {
            bgColor: "blue.100",
            color: "blue.400",
          },
        }}
      >
        <HamburgerIcon alignSelf="center" boxSize={5} />
      </IconButton>
      <Heading onClick={() => router.push(Routes.home.path())} cursor="pointer">
        SubSavvy
      </Heading>
      <Spacer />
      <ButtonGroup colorScheme="blue">
        <Button color="blue.100" onClick={logout}>
          logout
        </Button>
      </ButtonGroup>

      <Drawer placement="left" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>SubSavvy</DrawerHeader>
          <List className="w-full p-4">{renderItems()}</List>
        </DrawerContent>
      </Drawer>
    </Box>
  );

  function renderItems() {
    return [
      { label: "Home", path: Routes.home.path() },
      { label: "Create Client", path: Routes.createClient.path() },
    ]
      .filter(({ path }) => path !== pathname)
      .map(({ label, path }) => renderItem(label, path));
  }

  function renderItem(label: string, path: string) {
    return (
      <ListItem display="flex" onClick={() => setIsOpen(false)} key={label}>
        <Link as={NextLink} href={path} sx={itemSx}>
          {label}
        </Link>
      </ListItem>
    );
  }
};

const itemSx: SystemStyleObject = {
  width: "100%",
  color: "blue.400",
  p: 2,
  rounded: "md",
  _hover: {
    bgColor: "blue.100",
  },
};
