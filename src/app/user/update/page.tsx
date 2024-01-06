"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RhfInput, RhfPhoneInput } from "@/components";
import { useAuth } from "@/hooks";
import { trpc } from "@/lib";
import { Routes } from "@/routes";

const resolver = zodResolver(
  z.object({
    username: z.string().min(4),
    name: z.string().min(4),
    phone: z.string().min(10),
  }),
);

export default function UpdateUserPage() {
  const { oauthUser: user } = useAuth({ required: true });
  const router = useRouter();

  const createProfile = trpc.users.create.useMutation();
  const getProfile = trpc.users.getAuthed.useQuery();
  const updateProfile = trpc.users.update.useMutation();

  const { handleSubmit, formState, control } = useForm({
    defaultValues: {
      username: getProfile.data?.username || "",
      name: getProfile.data?.name || "",
      phone: getProfile.data?.phone || "",
    },
    resetOptions: {
      keepValues: false,
    },
    resolver,
  });

  const onSubmit = handleSubmit(async (data) => {
    if (getProfile.data?.id) {
      await updateProfile.mutateAsync({
        id: getProfile.data.id,
        ...data,
      });
    } else {
      await createProfile.mutateAsync(data);
    }

    router.push(Routes.home.path());
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

        <RhfInput label="Username" control={control} name="username" />

        <RhfInput label="Name" control={control} name="name" />

        <RhfPhoneInput label="Phone Number" control={control} name="phone" />

        <Button disabled={formState.isValid} type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
