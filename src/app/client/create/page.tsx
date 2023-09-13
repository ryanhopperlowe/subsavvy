"use client";

import { useAuth } from "@/hooks";
import { CreateClient } from "@/model";
import {
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Container,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  description: z
    .string()
    .min(4, "Description must be between 4 and 100 characters")
    .max(100, "Description must be between 4 and 100 characters"),
  email: z.string().email("Invalid email address"),
});

export default function CreateClient() {
  const { user: profile } = useAuth({ required: true });

  const { watch, handleSubmit, formState, register } = useForm({
    defaultValues: {
      description: "",
      email: "",
      name: "",
    },
    resolver: zodResolver(schema),
  });

  console.log(watch());

  const onSubmit = handleSubmit(console.log);
  const { errors } = formState;

  return (
    <Container>
      <form onSubmit={onSubmit}>
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
          <FormHelperText>{errors.description?.message || " "}</FormHelperText>
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
        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
}
