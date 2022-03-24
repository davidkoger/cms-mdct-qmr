import * as CUI from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";
import {
  allNumbers,
  eightNumbersOneDecimal,
  rateThatAllowsFourDecimals,
  rateThatAllowsOneDecimal,
  allPositiveIntegersWith8Digits,
} from "utils/numberInputMasks";
import * as QMR from "components";
import objectPath from "object-path";
import { useEffect } from "react";

const fixRounding = (value: number, numbersAfterDecimal: number) => {
  return (
    Math.round((value + Number.EPSILON) * (numbersAfterDecimal * 10)) /
    (numbersAfterDecimal * 10)
  );
};

export const rateCalculation = (
  numerator: string,
  denominator: string,
  rateMultiplicationValue: number,
  numbersAfterDecimal: number
) => {
  const floatNumerator = parseFloat(numerator);
  const floatDenominator = parseFloat(denominator);
  const floatRate = floatNumerator / floatDenominator;
  const roundedRate = fixRounding(
    floatRate * rateMultiplicationValue,
    numbersAfterDecimal
  );
  return roundedRate.toFixed(numbersAfterDecimal);
};

export interface IRate {
  label?: string;
  id: number;
  isTotal?: boolean;
}

interface Props extends QMR.InputWrapperProps {
  rates: IRate[];
  name: string;
  readOnly?: boolean;
  allowMultiple?: boolean;
  rateMultiplicationValue?: number;
  customMask?: RegExp;
  calcTotal?: boolean;
  allowNumeratorGreaterThanDenominator?: boolean;
}

export const Rate = ({
  rates,
  name,
  allowMultiple = false,
  readOnly = true,
  rateMultiplicationValue = 100,
  customMask,
  calcTotal,
  allowNumeratorGreaterThanDenominator,
  ...rest
}: Props) => {
  const {
    control,
    formState: { errors },
    unregister,
  } = useFormContext();

  const { field } = useController({
    name,
    control,
    defaultValue: [],
  });

  if (calcTotal) {
    rates[rates.length - 1]["isTotal"] = true;
  }

  /*
  On component render, verify that all NDRs have a label and isTotal value.
  This is required for accurate data representation in DB and to calculateTotals().
  */
  useEffect(() => {
    const prevRate = [...field.value];
    rates.forEach((rate, index) => {
      if (prevRate[index] === undefined) {
        prevRate[index] = {};
      }
      prevRate[index]["label"] = rate.label ?? undefined;
    });

    if (calcTotal) {
      prevRate[prevRate.length - 1]["isTotal"] = true;
    }

    field.onChange([...prevRate]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const changeRate = (
    index: number,
    type: "numerator" | "denominator" | "rate",
    newValue: string,
    isTotal?: boolean
  ) => {
    const digitsAfterDecimal = 1;
    if (!allNumbers.test(newValue)) return;
    if (type === "rate" && readOnly) return;

    const prevRate = [...field.value];
    const editRate = { ...prevRate[index] };
    const validEditRate = eightNumbersOneDecimal.test(newValue);

    if (
      (type === "numerator" || type === "denominator") &&
      allPositiveIntegersWith8Digits.test(newValue)
    ) {
      editRate[type] = validEditRate ? newValue : editRate[type];
    }

    if (type === "rate" && !readOnly) {
      prevRate[index] ??= {
        numerator: "",
        denominator: "",
        rate: "",
      };

      const regex = allowMultiple
        ? rateThatAllowsFourDecimals
        : rateThatAllowsOneDecimal;

      prevRate[index].rate =
        regex.test(newValue) || newValue === "" || customMask?.test(newValue)
          ? newValue
          : prevRate[index].rate;

      field.onChange([...prevRate]);
      return;
    }

    if (
      parseInt(editRate.denominator) &&
      editRate.numerator &&
      (parseFloat(editRate.numerator) <= parseFloat(editRate.denominator) ||
        allowNumeratorGreaterThanDenominator)
    ) {
      editRate.rate = rateCalculation(
        editRate.numerator,
        editRate.denominator,
        rateMultiplicationValue,
        digitsAfterDecimal
      );
    } else if (editRate.rate) {
      editRate.rate = "";
    }

    prevRate[index] = {
      label: rates[index].label,
      ...editRate,
    };

    // Totals NDR should be independently editable
    if (calcTotal && !isTotal) {
      calculateTotals(prevRate);
    }
    field.onChange([...prevRate]);
  };

  /*
  Iterate over all numerators and denominators of NDRs where isTotal is false.
  Sum these values and set the NDR where isTotal is true to be these sumed values.
  */
  const calculateTotals = (prevRate: any[]) => {
    let numeratorSum: any = null;
    let denominatorSum: any = null;
    let x;

    // sum all Ns and Ds
    // we assume last NDR is total if calcTotal is true
    prevRate.slice(0, -1).forEach((item) => {
      if (item !== undefined && item !== null && !item["isTotal"]) {
        if (!isNaN((x = parseFloat(item["numerator"])))) {
          numeratorSum = numeratorSum + x; // += syntax does not work if default value is null
        }
        if (!isNaN((x = parseFloat(item["denominator"])))) {
          denominatorSum = denominatorSum + x; // += syntax does not work if default value is null
        }
      }
    });

    // Set total values and calculate total rate
    let totalIndex = prevRate.length - 1;
    let newValue = numeratorSum !== null ? numeratorSum.toString() : "";
    prevRate[totalIndex]["numerator"] = newValue;

    newValue = denominatorSum !== null ? denominatorSum.toString() : "";
    prevRate[totalIndex]["denominator"] = denominatorSum;

    if (
      numeratorSum !== null &&
      denominatorSum !== null &&
      numeratorSum <= denominatorSum
    ) {
      prevRate[totalIndex]["rate"] =
        numeratorSum !== 0
          ? rateCalculation(
              numeratorSum.toString(),
              denominatorSum.toString(),
              rateMultiplicationValue,
              1
            )
          : "0";
    } else {
      prevRate[totalIndex]["rate"] = "";
    }
  };

  useEffect(
    () => () => {
      unregister(name);
    },
    [unregister, name]
  );

  return (
    <>
      {rates.map((rate, index) => {
        const isTotal = rate.isTotal ?? undefined;
        return (
          <CUI.Stack key={rate.id} mt={4} mb={8}>
            {rate.label && (
              <CUI.FormLabel fontWeight={700} data-cy={rate.label}>
                {rate.label}
              </CUI.FormLabel>
            )}
            <CUI.HStack spacing={16}>
              <QMR.InputWrapper
                label="Numerator"
                isInvalid={
                  !!objectPath.get(errors, `${name}.${index}.numerator`)
                    ?.message
                }
                errorMessage={
                  objectPath.get(errors, `${name}.${index}.numerator`)?.message
                }
                {...rest}
              >
                <CUI.Input
                  value={field.value[index]?.numerator ?? ""}
                  data-cy={`${name}.${index}.numerator`}
                  onChange={(e) =>
                    changeRate(index, "numerator", e.target.value, isTotal)
                  }
                />
              </QMR.InputWrapper>
              <QMR.InputWrapper
                label="Denominator"
                isInvalid={
                  !!objectPath.get(errors, `${name}.${index}.denominator`)
                    ?.message
                }
                errorMessage={
                  objectPath.get(errors, `${name}.${index}.denominator`)
                    ?.message
                }
                {...rest}
              >
                <CUI.Input
                  value={field.value[index]?.denominator ?? ""}
                  data-cy={`${name}.${index}.denominator`}
                  onChange={(e) =>
                    changeRate(index, "denominator", e.target.value, isTotal)
                  }
                />
              </QMR.InputWrapper>
              <QMR.InputWrapper
                label="Rate"
                isInvalid={
                  !!objectPath.get(errors, `${name}.${index}.rate`)?.message
                }
                errorMessage={
                  objectPath.get(errors, `${name}.${index}.rate`)?.message
                }
                {...rest}
              >
                <CUI.Input
                  value={field.value[index]?.rate ?? ""}
                  data-cy={`${name}.${index}.rate`}
                  onChange={(e) =>
                    changeRate(index, "rate", e.target.value, isTotal)
                  }
                  readOnly={readOnly}
                />
              </QMR.InputWrapper>
            </CUI.HStack>
            {!allowNumeratorGreaterThanDenominator &&
              parseFloat(field.value[index]?.numerator) >
                parseFloat(field.value[index]?.denominator) && (
                <QMR.Notification
                  alertTitle="Rate Error"
                  alertDescription={`Numerator: ${field.value[index]?.numerator} cannot be greater than Denominator: ${field.value[index]?.denominator}`}
                  alertStatus="warning"
                />
              )}
          </CUI.Stack>
        );
      })}
    </>
  );
};
