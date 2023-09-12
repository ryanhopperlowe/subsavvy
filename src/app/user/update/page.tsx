"use client";

import InputMask from "react-input-mask";
import { useAuth } from "@/hooks";
import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib";
import { z } from "zod";

const resolver = zodResolver(
  z.object({
    username: z.string().min(4),
    name: z.string().min(4),
    phone: z.string().min(10),
  })
);

export default function UpdateUserPage() {
  const { user } = useAuth({ required: true });

  const createUser = trpc.users.create.useMutation();
  const getUser = trpc.users.getAuthed.useQuery(undefined, {
    enabled: false,
  });
  const updateUser = trpc.users.update.useMutation();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: async () => {
      const profile =
        (await getUser.refetch()).data ||
        ({} as Partial<NonNullable<typeof getUser.data>>);

      return {
        username: profile.username || "",
        name: profile.name || "",
        phone: profile.phone || "",
      };
    },
    resetOptions: {
      keepValues: false,
    },
    resolver,
  });

  const onSubmit = handleSubmit((data) => {
    if (getUser.data?.id) {
      updateUser.mutate({ id: getUser.data.id, ...data });
      return;
    }
    createUser.mutate(data);
  });

  return (
    <Container>
      <form
        className="flex flex-col justify-between align-middle"
        onSubmit={onSubmit}
      >
        <Heading size="md">Update User</Heading>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" disabled value={user.email || ""} />
          </FormControl>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input type="text" {...register("username", { required: true })} />
            <FormHelperText>
              {formState.errors.username?.message}
            </FormHelperText>
          </FormControl>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="John Doe"
              {...register("name", { required: true })}
            />
            <FormHelperText>{formState.errors.name?.type}</FormHelperText>
          </FormControl>
          <FormControl id="phone">
            <FormLabel>Phone Number</FormLabel>
            <Input
              as={InputMask}
              type="tel"
              placeholder="(123) 456-7890"
              mask="(999) 999-9999"
              {...register("phone", { required: true })}
            />
            <FormHelperText>{formState.errors.phone?.type}</FormHelperText>
          </FormControl>
          <Button disabled={formState.isValid} type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
