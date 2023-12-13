"use client";

import {
  Input,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Container,
  Textarea,
  Button,
  Heading,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/hooks";
import { trpc } from "@/lib";
import { useRouter } from "next/navigation";
import { Routes } from "@/routes";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  description: z
    .string()
    .min(4, "Description must be between 4 and 100 characters")
    .max(100, "Description must be between 4 and 100 characters"),
  email: z.string().email("Invalid email address"),
  otherEmails: z.array(z.string().email("Invalid email address")),
});

type Fields = {
  name: string;
  description: string;
  email: string;
  otherEmails: string[];
};

export default function CreateClient() {
  const { user: profile } = useAuth({ required: true });
  const router = useRouter();

  const createClient = trpc.services.create.useMutation({
    onSuccess: () => router.push(Routes.serviceList.path()),
  });

  const emailForm = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(
      z.object({ email: z.string().email("Invalid email address") })
    ),
  });

  const { watch, handleSubmit, formState, register, setValue, control } =
    useForm<Fields>({
      defaultValues: {
        description: "",
        email: "",
        name: "",
        otherEmails: [],
      },
      resolver: zodResolver(schema),
    });

  // TODO - add emails to backendn service to be able to invite users
  const onSubmit = handleSubmit(async ({ otherEmails, ...data }) => {
    createClient.mutate({ ...data, users: [profile.id] });
  });
  const { errors } = formState;

  return (
    <Container className="flex flex-col gap-4 align-middle p-4 h-full">
      {createClient.isLoading ? (
        <Box className="h-full w-full flex justify-center">
          <Spinner />
        </Box>
      ) : (
        <>
          <Heading size="lg" className="text-center">
            Create Your Service
          </Heading>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-2 align-middle"
          >
            <FormControl>
              <FormLabel>Give your service a name</FormLabel>
              <Input
                isInvalid={!!errors.name}
                placeholder=""
                {...register("name", { required: true })}
              />
              <FormHelperText>{errors.name?.message || " "}</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>
                Give a brief description of what your service provides
              </FormLabel>
              <Textarea
                isInvalid={!!errors.description}
                rows={4}
                {...register("description")}
                placeholder="Description"
              />
              <FormHelperText>
                {errors.description?.message || " "}
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Primary Contact Email</FormLabel>
              <Input
                isInvalid={!!errors.email}
                errorBorderColor="red.300"
                type="email"
                {...register("email", { required: true })}
              />
              <FormHelperText>{errors.email?.message || " "}</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Invite other people to manage this Service</FormLabel>
              <Box className="grid grid-cols-12 gap-2">
                <Box className="col-span-10">
                  <Input
                    type="email"
                    placeholder="Email"
                    errorBorderColor="red.300"
                    {...emailForm.register("email", { required: true })}
                  />
                  <FormHelperText>
                    {emailForm.formState.errors.email?.message || " "}
                  </FormHelperText>
                </Box>
                <Button
                  className="col-span-2"
                  colorScheme="blue"
                  isDisabled={!emailForm.formState.isValid}
                  variant="outline"
                  onClick={() => {
                    setValue(
                      "otherEmails",
                      watch("otherEmails").concat(emailForm.watch("email"))
                    );
                    emailForm.reset();
                  }}
                >
                  Add
                </Button>
                {watch("otherEmails").map((email, i) => (
                  <>
                    <Text className="col-span-10 pl-4">{email}</Text>
                    <Button
                      className="col-span-2"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        setValue(
                          "otherEmails",
                          watch("otherEmails").filter((_, j) => j !== i)
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </>
                ))}
              </Box>
              <Box></Box>
            </FormControl>

            <Button w="full" type="submit">
              Submit
            </Button>
          </form>
        </>
      )}
    </Container>
  );
}
