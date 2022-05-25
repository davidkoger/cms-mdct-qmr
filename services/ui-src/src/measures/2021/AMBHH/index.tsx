import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import * as CMQ from "measures/2021/CommonQuestions";
import * as PMD from "./data";
import * as QMR from "components";
import { validationFunctions } from "./validation";
import { getPerfMeasureRateArray } from "measures/2021/globalValidations";
import { FormData } from "./types";
import { positiveNumbersWithMaxDecimalPlaces } from "utils/numberInputMasks";

export const AMBHH = ({
  name,
  year,
  measureId,
  setValidationFunctions,
  isNotReportingData,
  isPrimaryMeasureSpecSelected,
  showOptionalMeasureStrat,
  isOtherMeasureSpecSelected,
}: QMR.MeasureWrapperProps) => {
  const { watch } = useFormContext<FormData>();
  const data = watch();
  useEffect(() => {
    if (setValidationFunctions) {
      setValidationFunctions(validationFunctions);
    }
  }, [setValidationFunctions]);

  const performanceMeasureArray = getPerfMeasureRateArray(data, PMD.data);

  return (
    <>
      <CMQ.Reporting
        reportingYear={year}
        measureName={name}
        measureAbbreviation={measureId}
        healthHomeMeasure
      />

      {!isNotReportingData && (
        <>
          <CMQ.StatusOfData />
          <CMQ.MeasurementSpecification type="HEDIS" />
          <CMQ.DataSource />
          <CMQ.DateRange type="health" />
          <CMQ.DefinitionOfPopulation healthHomeMeasure />
          {isPrimaryMeasureSpecSelected && (
            <>
              <CMQ.PerformanceMeasure
                allowNumeratorGreaterThanDenominator
                data={PMD.data}
                rateScale={1000}
                customMask={positiveNumbersWithMaxDecimalPlaces(1)}
                calcTotal
                customNumeratorLabel="ED Visits"
                customDenominatorLabel="Enrollee Months"
                customRateLabel="Visits per 1,000 Enrollee Months"
              />
              <CMQ.DeviationFromMeasureSpec categories={PMD.categories} />
            </>
          )}
          {isOtherMeasureSpecSelected && (
            <CMQ.OtherPerformanceMeasure
              allowNumeratorGreaterThanDenominator
              rateMultiplicationValue={1000}
              customMask={positiveNumbersWithMaxDecimalPlaces(1)}
            />
          )}
          <CMQ.CombinedRates healthHomeMeasure />
          {showOptionalMeasureStrat && (
            <CMQ.OptionalMeasureStrat
              categories={PMD.categories}
              qualifiers={PMD.qualifiers}
              rateMultiplicationValue={1000}
              customMask={positiveNumbersWithMaxDecimalPlaces(1)}
              performanceMeasureArray={performanceMeasureArray}
              adultMeasure={false}
              calcTotal
              customNumeratorLabel={
                isPrimaryMeasureSpecSelected ? "ED Visits" : "Numerator"
              }
              customDenominatorLabel={
                isPrimaryMeasureSpecSelected ? "Enrollee Months" : "Denominator"
              }
              customRateLabel={
                isPrimaryMeasureSpecSelected
                  ? "Visits per 1,000 Enrollee Months"
                  : "Rate"
              }
              allowNumeratorGreaterThanDenominator
            />
          )}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
