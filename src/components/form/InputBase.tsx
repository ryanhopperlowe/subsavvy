import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { max } from "date-fns";
import { ReactNode } from "react";

type InputBaseProps = {
  label?: ReactNode;
  classes?: {
    root?: string;
    input?: string;
  };
  children: ReactNode;
  error?: string;
};

export function InputBase(props: InputBaseProps) {
  const { label, classes, children, error } = props;
  return (
    <FormControl className={classes?.root}>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      <FormHelperText color="red">{error}</FormHelperText>
    </FormControl>
  );
}
