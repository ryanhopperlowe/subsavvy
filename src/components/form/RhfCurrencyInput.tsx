"use client";

import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import { InputBase } from "./InputBase";
import { Fields, RHFInputProps } from "./helpers";

type RhfCurrencyInputProps<TFields extends Fields> = RHFInputProps<TFields> & {
  max?: number;
  placeholder?: string;
  isDisabled?: boolean;
};

export function RhfCurrencyInput<TFields extends Fields>(
  props: RhfCurrencyInputProps<TFields>,
) {
  const { label, name, control, classes, max, isDisabled, ...inputProps } =
    props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, onChange, ...field }, fieldState }) => (
        <InputBase
          label={label}
          error={fieldState.error?.message}
          classes={classes}
        >
          <InputGroup>
            <InputLeftAddon>$</InputLeftAddon>
            <NumericFormat
              customInput={Input}
              {...field}
              {...inputProps}
              allowNegative={false}
              max={max}
              isDisabled={isDisabled}
              className={classes?.input}
              decimalScale={2}
              onValueChange={({ floatValue }) => onChange(floatValue || 0)}
            />
          </InputGroup>
        </InputBase>
      )}
    />
  );
}
