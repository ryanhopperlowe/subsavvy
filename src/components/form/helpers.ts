import { ComponentProps, ComponentType, ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export type RHFInputProps<
  TFields extends FieldValues,
  TInputProps extends ComponentType = ComponentType,
> = ComponentProps<TInputProps> & {
  label?: ReactNode;
  classes?: {
    input?: string;
    root?: string;
  };
  name: FieldPath<TFields>;
  control: Control<TFields>;
};

export type Fields = FieldValues;
