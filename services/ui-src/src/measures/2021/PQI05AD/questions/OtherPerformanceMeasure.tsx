import * as QMR from "components";
import * as CUI from "@chakra-ui/react";
import { useCustomRegister } from "hooks/useCustomRegister";
import { Measure } from "../validation/types";
import React from "react";
import { useFormContext } from "react-hook-form";
import { positiveNumbersWithMaxDecimalPlaces } from "utils/numberInputMasks";

export const OtherPerformanceMeasure = () => {
  const register = useCustomRegister<Measure.Form>();
  const { getValues } = useFormContext<Measure.Form>();
  const savedRates = getValues("OtherPerformanceMeasure-Rates");
  const [showRates, setRates] = React.useState(
    savedRates ?? [
      { rate: [{ denominator: "", numerator: "", rate: "" }], description: "" },
    ]
  );

  const { watch } = useFormContext<Measure.Form>();

  // Watch for dataSource data
  const dataSourceWatch = watch("DataSource");

  // Conditional check to let rate be readonly when administrative data is the only option or no option is selected
  const rateReadOnly =
    dataSourceWatch?.every(
      (source) => source === "I am reporting provisional data."
    ) ?? true;

  return (
    <QMR.CoreQuestionWrapper label="Other Performance Measure">
      <QMR.TextArea
        label="Describe the other methodology used:"
        formLabelProps={{ fontWeight: 700 }}
        {...register("OtherPerformanceMeasure-Explanation")}
      />
      <CUI.Box marginTop={10}>
        {showRates.map((_item, index) => {
          return (
            <CUI.Stack key={index} my={10}>
              <CUI.Heading fontSize="lg" fontWeight="600">
                Describe the Rate:
              </CUI.Heading>
              <QMR.TextInput
                label="For example, specify the age groups and whether you are reporting on a certain indicator:"
                name={`OtherPerformanceMeasure-Rates.${index}.description`}
              />
              <QMR.Rate
                rates={[
                  {
                    id: index,
                  },
                ]}
                name={`OtherPerformanceMeasure-Rates.${index}.rate`}
                readOnly={rateReadOnly}
                customMask={positiveNumbersWithMaxDecimalPlaces(1)}
                rateMultiplicationValue={100000}
              />
            </CUI.Stack>
          );
        })}

        <QMR.ContainedButton
          buttonText={"+ Add Another"}
          buttonProps={{
            variant: "outline",
            colorScheme: "blue",
            textTransform: "capitalize",
          }}
          onClick={() => {
            showRates.push({
              description: [""],
              rate: [
                {
                  denominator: "",
                  numerator: "",
                  rate: "",
                },
              ],
            });
            setRates([...showRates]);
          }}
        />
      </CUI.Box>
    </QMR.CoreQuestionWrapper>
  );
};