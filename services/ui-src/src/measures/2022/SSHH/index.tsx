import { useEffect } from "react";
import * as CUI from "@chakra-ui/react";
import * as CMQ from "measures/2022/CommonQuestions";
import * as QMR from "components";
import * as PMD from "./data";
import { validationFunctions } from "./validation";
import { PerformanceMeasure } from "./questions/PerformanceMeasure";

export const SSHH = ({
  detailedDescription,
  setValidationFunctions,
}: QMR.MeasureWrapperProps) => {
  useEffect(() => {
    if (setValidationFunctions) {
      setValidationFunctions(validationFunctions);
    }
  }, [setValidationFunctions]);

  return (
    <>
      <CUI.Text
        fontSize="xl"
        my="6"
        fontWeight={400}
        data-cy="detailed-description"
      >
        {detailedDescription}
      </CUI.Text>
      <CMQ.StatusOfData />
      <CMQ.DataSource data={PMD.dataSourceData} />
      <CMQ.DateRange type="health" />
      <CMQ.DefinitionOfPopulation healthHomeMeasure hybridMeasure />
      <PerformanceMeasure hybridMeasure />
      <CMQ.AdditionalNotes />
    </>
  );
};
