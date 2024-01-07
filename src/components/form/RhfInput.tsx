"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { InputBase } from "./InputBase";
import { Fields, RHFInputProps } from "./helpers";

type RhfInputProps<TFields extends Fields> = RHFInputProps<
  TFields,
  typeof Input
>;

export function RhfInput<T extends Fields>(props: RhfInputProps<T>) {
  const { label, name, control, classes, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <InputBase
          label={label}
          error={fieldState.error?.message}
          classes={classes}
        >
          <Input {...field} {...inputProps} className={classes?.input} />
        </InputBase>
      )}
    />
  );
}
