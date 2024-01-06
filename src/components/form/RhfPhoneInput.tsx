"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";

import { Fields, RHFInputProps } from "./helpers";

type RhfPhoneInputProps<TFields extends Fields> = RHFInputProps<TFields>;

export function RhfPhoneInput<TFields extends Fields>(
  props: RhfPhoneInputProps<TFields>,
) {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field: { ref: _, onChange, ...field }, fieldState }) => (
        <FormControl>
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <PatternFormat
            customInput={Input}
            {...field}
            format="(###) ###-####"
            mask="_"
            allowEmptyFormatting
            onValueChange={({ value }) => onChange(value)}
          />
          <FormHelperText>{fieldState.error?.message || " "}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
