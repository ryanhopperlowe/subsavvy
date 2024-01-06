"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { Fields, RHFInputProps } from "./helpers";

type RhfInputProps<TFields extends Fields> = RHFInputProps<
  TFields,
  typeof Input
>;

export function RhfInput<T extends Fields>(props: RhfInputProps<T>) {
  const { label, name, control, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl>
          {label && <FormLabel>{label}</FormLabel>}
          <Input {...field} {...inputProps} />
          <FormHelperText color="red">
            {fieldState.error?.message || "  "}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
