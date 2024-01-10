"use client";

import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { InputBase } from "./InputBase";
import { Fields, RHFInputProps } from "./helpers";

type RhfCheckboxProps<TFields extends Fields> = RHFInputProps<
  TFields,
  typeof Checkbox
>;

export function RhfCheckbox<T extends Fields>(props: RhfCheckboxProps<T>) {
  const { label, name, control, classes, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        return (
          <Checkbox
            {...inputProps}
            {...field}
            isChecked={value}
            onChange={onChange}
          >
            {label}
          </Checkbox>
        );
      }}
    />
  );
}
