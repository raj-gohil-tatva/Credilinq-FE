import { TextField, FilledInputProps, TextFieldProps } from "@mui/material";
import { HTMLInputTypeAttribute } from "react";

interface Props {
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  onChange?: FilledInputProps["onChange"];
  onBlur?: FilledInputProps["onBlur"];
  value?: any;
  placeholder?: string;
  fullWidth?: boolean;
  helperText?: string;
  type?: HTMLInputTypeAttribute;
  variant?: "outlined" | "filled" | "standard";
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
}

const InputField = ({
  className,
  id,
  label,
  name,
  value = "",
  helperText = "",
  type = "text",
  variant = "outlined",
  required = false,
  disabled = false,
  error = false,
  ...restProps
}: TextFieldProps) => {
  return (
    <TextField
      className={className}
      id={id}
      name={name}
      label={label}
      value={value}
      type={type}
      variant={variant}
      required={required}
      disabled={disabled}
      helperText={helperText}
      error={error}
      {...restProps}
    />
  );
};

export default InputField;
