import * as QMR from "components";
import * as Types from "../types";
import * as DC from "dataConstants";
import { useWatch } from "react-hook-form";
import { useCustomRegister } from "hooks/useCustomRegister";

interface GetTopLvlDeviationOptions {
  categories: string[];
  customTotalLabel?: string;
}

type TopLevelOptions = {
  displayValue: string;
  rates: Types.RateFields[] | undefined;
  key: string;
}[];

interface Props {
  categories: string[];
  customTotalLabel?: string;
  measureName?: string;
}

interface OptionProps {
  name: string;
  qualifiers?: Types.RateFields[];
}

/**
 * It removes all non-word characters from a string.
 * @param {string} [s] - The string to be cleaned.
 */
const cleanString = (s?: string) => s?.replace(/[^\w]/g, "");

/**
 * Check if the rate has both a numerator and a denominator.
 * @param el - The rate field that we're checking.
 */
const numDenExistInRate = (el: Types.RateFields) =>
  el?.numerator && el?.denominator;

/**
 * Check if the rates within a qualifier have both a numerator and a denominator.
 * @param qualifier - The qualifier that we're checking.
 */
const complexNumDenExistInRate = (qualifier: any) => {
  return qualifier.fields.some(
    (field: any) => field?.value && field?.value !== ""
  );
};

/**
 * It returns an array of objects that contain a display value, value, and single TextArea child
 * @param {string} name - The name of the field.
 */
const getRateTextAreaOptions = (name: string) =>
  ["Numerator", "Denominator", "Other"].map((displayValue) => {
    const value = displayValue.toLowerCase();
    return {
      displayValue,
      value,
      children: [
        <QMR.TextArea
          label="Explain:"
          name={`${name}.${value}`}
          key={`${name}.${value}`}
        />,
      ],
    };
  });

/* This is a custom checkbox component that is used to render the checkboxes for the rate deviations. */
const DeviationsSelectedCheckbox = ({ name }: { name: string }) => (
  <QMR.Checkbox
    name={`${name}.${DC.RATE_DEVIATIONS_SELECTED}`}
    key={`${name}.${DC.RATE_DEVIATIONS_SELECTED}`}
    options={getRateTextAreaOptions(name)}
  />
);

/**
 * It takes in a list of qualifiers and returns options based on if the rates contain a label
 * @param {OptionProps}  - qualifier: the qualifier object - name: a name to register the input with
 * @returns A list of options
 */
export const getLowLvlDeviationOptions = ({
  qualifiers,
  name,
}: OptionProps) => {
  if (!qualifiers || qualifiers.length === 0) return [];

  // if there are no labels then there is no need for the additional checkbox
  if (!qualifiers.some((el) => el.label)) {
    return getRateTextAreaOptions(name);
  }

  return qualifiers
    .sort((a, b) => (a.label!! < b.label!! ? 1 : 1))
    .map((item) => {
      const value = `${cleanString(item.label)}`;
      return {
        displayValue: item.label!,
        value,
        children: [
          <DeviationsSelectedCheckbox
            name={`${name}.${value}`}
            key={`${name}.${value}`}
          />,
        ],
      };
    });
};

export const PCRADgetLowLvlDeviationOptions = ({
  qualifiers,
  name,
}: OptionProps) => {
  if (!qualifiers || qualifiers.length === 0) return [];

  return getRateTextAreaOptions(name);
};

export const DeviationFromMeasureSpec = ({
  categories,
  measureName = "",
  customTotalLabel,
}: Props) => {
  const register = useCustomRegister<Types.DeviationFromMeasureSpecification>();
  const watchPerformanceMeasure = useWatch({
    name: DC.PERFORMANCE_MEASURE,
  });

  const getTopLvlDeviationOptions = ({
    categories,
    customTotalLabel,
  }: GetTopLvlDeviationOptions) => {
    if (watchPerformanceMeasure?.rates) {
      const topLvlOptions: TopLevelOptions = [];
      const { rates } = watchPerformanceMeasure;

      if (rates.singleCategory) {
        // handle for PCR-XX measures
        if (["PCR-AD", "PCR-HH"].includes(measureName)) {
          const quals = rates.singleCategory.filter((r: any) => r.value !== "");
          if (quals.length > 0) {
            return getRateTextAreaOptions(DC.DEVIATIONS);
          }
        }
        // A total category should have the label "Total", per the Figma design.
        const totalIndex = rates.singleCategory.findIndex(
          (cat: any) => cat.isTotal === true
        );
        if (totalIndex >= 0) {
          rates.singleCategory[totalIndex].label = `${
            customTotalLabel ? `${customTotalLabel} ` : "Total"
          }`;
        }
        /* This is checking if the rates object has a singleCategory key.
        If it does, then it will return the low level deviation options. */
        return getLowLvlDeviationOptions({
          qualifiers:
            measureName === "AIF-HH"
              ? rates.singleCategory.filter(complexNumDenExistInRate)
              : rates.singleCategory.filter(numDenExistInRate),
          name: DC.DEVIATIONS,
        });
      } else {
        categories.forEach((cat) => {
          const key = cat.replace(/[^\w]/g, "");
          // if some of the rates have both num and den
          const deviations =
            measureName === "IU-HH"
              ? rates[key]?.some(complexNumDenExistInRate)
              : rates[key]?.some(numDenExistInRate);
          const deviationRates =
            measureName === "IU-HH"
              ? rates[key]?.filter(complexNumDenExistInRate)
              : rates[key]?.filter(numDenExistInRate);

          if (deviations) {
            // add the rates that have num and den to topLvlOptions along with its display value from categories
            topLvlOptions.push({
              rates: deviationRates,
              displayValue: cat,
              key,
            });
          }
        });
      }

      return (
        topLvlOptions?.map((option) => {
          return {
            value: option.key,
            displayValue: option.displayValue,
            children: [
              <QMR.Checkbox
                {...register(
                  `${DC.DEVIATIONS}.${option.key}.${DC.SELECTED_OPTIONS}`
                )}
                formLabelProps={{ fontWeight: 600 }}
                key={`${DC.DEVIATIONS}.${option.key}`}
                options={getLowLvlDeviationOptions({
                  qualifiers: option.rates,
                  name: `${DC.DEVIATIONS}.${option.key}`,
                })}
              />,
            ],
          };
        }) ?? []
      );
    }
    return [];
  };

  return (
    <QMR.CoreQuestionWrapper label="Deviations from Measure Specifications">
      <QMR.RadioButton
        renderHelperTextAbove
        {...register(DC.DID_CALCS_DEVIATE)}
        formLabelProps={{ fontWeight: 600 }}
        label="Did your calculation of the measure deviate from the measure specification in any way?"
        helperText="For example: deviation from measure specification might include different methodology, timeframe, or reported age groups."
        options={[
          {
            displayValue:
              "Yes, the calculation of the measure deviates from the measure specification.",
            value: DC.YES,
            children: [
              <QMR.Checkbox
                {...register(DC.DEVIATION_OPTIONS)}
                label="Select and explain the deviation(s):"
                options={getTopLvlDeviationOptions({
                  categories,
                  customTotalLabel,
                })}
              />,
            ],
          },
          {
            displayValue:
              "No, the calculation of the measure does not deviate from the measure specification in any way.",
            value: DC.NO,
          },
        ]}
      />
    </QMR.CoreQuestionWrapper>
  );
};
