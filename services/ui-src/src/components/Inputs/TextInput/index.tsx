import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { useController, useFormContext } from "react-hook-form";
import objectPath from "object-path";
import { ControllerRules } from "global";

interface TextInputProps extends QMR.InputWrapperProps, ControllerRules {
  placeholder?: string;
  name: string;
  textInputProps?: CUI.InputProps;
}

export const TextInput = ({
  textInputProps,
  placeholder,
  name,
  rules,
  ...rest
}: TextInputProps) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const { field } = useController({
    name,
    control,
    rules,
  });

  const path = objectPath.get(errors, name);

  return (
    <QMR.InputWrapper
      isInvalid={!!path?.message || path?.type === "required"}
      errorMessage={
        path?.message ||
        (path?.type === "required" && `This is a required field`)
      }
      {...rest}
    >
      <CUI.Input
        type="text"
        name={name}
        placeholder={placeholder}
        value={field.value ?? ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        data-cy={name}
        {...textInputProps}
      />
    </QMR.InputWrapper>
  );
};
