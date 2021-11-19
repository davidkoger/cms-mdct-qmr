import * as CUI from "@chakra-ui/react";
import { InputWrapper, InputWrapperProps } from "components/InputWrapper";

// This interface will be needed in other files to setup the RadioButtonOptions Array
export interface RadioButtonOption {
  displayValue: string;
  value: string | number;
}

interface RadioButtonProps extends InputWrapperProps {
  value: string;
  onChange: (nextValue: string) => void;
  options: RadioButtonOption[];
  radioGroupProps?: CUI.RadioGroupProps;
}

export const RadioButton = ({
  options,
  value,
  onChange,
  isInvalidFunc,
  radioGroupProps,
  ...rest
}: RadioButtonProps) => {
  let isInvalid = false;
  if (isInvalidFunc) {
    isInvalid = isInvalidFunc(value);
  }

  return (
    <InputWrapper isInvalid={isInvalid} {...rest}>
      <CUI.RadioGroup value={value} onChange={onChange} {...radioGroupProps}>
        <CUI.Stack>
          {options.map(({ displayValue, value }) => (
            <CUI.Radio value={value} key={value}>
              {displayValue}
            </CUI.Radio>
          ))}
        </CUI.Stack>
      </CUI.RadioGroup>
    </InputWrapper>
  );
};