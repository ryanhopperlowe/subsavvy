"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { Fields, RHFInputProps } from "./helpers";

type RhfTextAreaProps<TFields extends Fields> = RHFInputProps<
  TFields,
  typeof Textarea
>;

export function RhfTextArea<T extends Fields>(props: RhfTextAreaProps<T>) {
  const { label, name, control, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl>
          {label && <FormLabel>{label}</FormLabel>}
          <Textarea {...field} {...inputProps} />
          <FormHelperText color="red">
            {fieldState.error?.message || "  "}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
