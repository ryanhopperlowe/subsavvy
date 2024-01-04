"use client";

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { z } from "zod";

import { useAuth } from "@/hooks";
import { trpc } from "@/lib";

const resolver = zodResolver(
  z.object({
    username: z.string().min(4),
    name: z.string().min(4),
    phone: z.string().min(10),
  }),
);

export default function UpdateUserPage() {
  const { oauthUser: user } = useAuth({ required: true });

  const createProfile = trpc.users.create.useMutation();
  const getProfile = trpc.users.getAuthed.useQuery(undefined, {
    enabled: false,
  });
  const updateProfile = trpc.users.update.useMutation();

  const { watch, register, handleSubmit, formState } = useForm({
    defaultValues: async () => {
      const profile =
        (await getProfile.refetch()).data ||
        ({} as Partial<NonNullable<typeof getProfile.data>>);

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
    if (getProfile.data?.id) {
      updateProfile.mutate({
        id: getProfile.data.id,
        ...data,
      });
      return;
    }

    createProfile.mutate(data);
  });

  return (
    <form
      className="flex flex-col justify-between align-middle"
      onSubmit={onSubmit}
    >
      <Heading size="md">Update User</Heading>
      <Stack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input type="email" disabled value={user.email} />
        </FormControl>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input type="text" {...register("username", { required: true })} />
          <FormHelperText>{formState.errors.username?.message}</FormHelperText>
        </FormControl>
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input placeholder="John Doe" {...register("name")} />
          <FormHelperText>{formState.errors.name?.type}</FormHelperText>
        </FormControl>
        <FormControl id="phone">
          <FormLabel>Phone Number</FormLabel>
          <Input
            as={PatternFormat}
            type="tel"
            placeholder="(123) 456-7890"
            pattern="(###) ###-####"
            allowEmptyFormatting
            mask="_"
            {...register("phone", { required: true })}
          />
          <FormHelperText>{formState.errors.phone?.type}</FormHelperText>
        </FormControl>
        <Button disabled={formState.isValid} type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
