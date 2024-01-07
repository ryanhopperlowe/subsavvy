"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Controller } from "react-hook-form";

import { InputBase } from "./InputBase";
import { Fields, RHFInputProps } from "./helpers";

type Option = {
  label: string;
  value: string;
};

type RhfSelectProps<TFields extends Fields> = RHFInputProps<
  TFields,
  typeof Select<Option>
> & {
  options: Option[];
};

export function RhfSelect<T extends Fields>(props: RhfSelectProps<T>) {
  const { label, name, control, options, classes, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field }, fieldState }) => (
        <InputBase
          label={label}
          classes={classes}
          error={fieldState.error?.message}
        >
          <Select
            {...field}
            {...inputProps}
            className={classes?.input}
            value={options.find((opt: Option) => opt.value === value)}
            onChange={(option) => onChange(option?.value || null)}
            options={options}
          />
        </InputBase>
      )}
    />
  );
}
