"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { InputBase } from "./InputBase";
import { Fields, RHFInputProps } from "./helpers";

type RhfTextAreaProps<TFields extends Fields> = RHFInputProps<
  TFields,
  typeof Textarea
>;

export function RhfTextArea<T extends Fields>(props: RhfTextAreaProps<T>) {
  const { label, name, control, classes, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <InputBase
          label={label}
          classes={classes}
          error={fieldState.error?.message}
        >
          <Textarea {...field} {...inputProps} className={classes?.input} />
        </InputBase>
      )}
    />
  );
}
