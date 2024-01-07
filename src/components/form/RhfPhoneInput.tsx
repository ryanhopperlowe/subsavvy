"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";

import { InputBase } from "./InputBase";
import { Fields, RHFInputProps } from "./helpers";

type RhfPhoneInputProps<TFields extends Fields> = RHFInputProps<TFields>;

export function RhfPhoneInput<TFields extends Fields>(
  props: RhfPhoneInputProps<TFields>,
) {
  const { label, name, control, classes, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, onChange, ...field }, fieldState }) => (
        <InputBase
          label={label}
          classes={classes}
          error={fieldState.error?.message}
        >
          <PatternFormat
            customInput={Input}
            {...field}
            {...inputProps}
            className={classes?.input}
            format="(###) ###-####"
            mask="_"
            allowEmptyFormatting
            onValueChange={({ value }) => onChange(value)}
          />
        </InputBase>
      )}
    />
  );
}
