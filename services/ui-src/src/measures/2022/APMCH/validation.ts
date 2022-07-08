import * as DC from "dataConstants";
import * as GV from "measures/2022/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "measures/2022/CommonQuestions/OptionalMeasureStrat/data";

const APMCHValidation = (data: FormData) => {
  const dateRange = data[DC.DATE_RANGE];
  const deviationArray = GV.getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const OPM = data[DC.OPM_RATES];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  const validateEqualQualifierDenominatorsErrorMessage = (
    qualifier: string
  ) => {
    const isTotal = qualifier.split(" ")[0] === "Total";
    return `${
      isTotal ? "" : "The "
    }${qualifier} denominator must be the same for each indicator.`;
  };

  const validateTotalNDRErrorMessage = (
    qualifier: string,
    fieldType: string
  ) => {
    return `${fieldType} for the ${qualifier} Total rate is not equal to the sum of the ${qualifier} age-specific ${fieldType.toLowerCase()}s.`;
  };

  errorArray = [
    // Performance Measure and OPM Validations
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      PMD.qualifiers,
      PMD.categories
    ),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateNumeratorsLessThanDenominatorsPM(
      performanceMeasureArray,
      OPM,
      PMD.qualifiers
    ),
    ...GV.validateNoNonZeroNumOrDenomPM(
      performanceMeasureArray,
      OPM,
      PMD.qualifiers,
      data
    ),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      performanceMeasureArray,
      PMD.qualifiers,
      deviationArray,
      didCalculationsDeviate
    ),
    ...GV.validateTotalNDR(
      performanceMeasureArray,
      undefined,
      PMD.categories,
      validateTotalNDRErrorMessage
    ),
    ...GV.validateEqualQualifierDenominatorsPM(
      performanceMeasureArray,
      PMD.qualifiers,
      undefined,
      validateEqualQualifierDenominatorsErrorMessage
    ),

    // OMS Validations
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: GV.omsLocationDictionary(
        OMSData(true),
        PMD.qualifiers,
        PMD.categories
      ),
      validationCallbacks: [
        GV.validateNumeratorLessThanDenominatorOMS,
        GV.validateEqualQualifierDenominatorsOMS,
        GV.validateRateZeroOMS,
        GV.validateRateNotZeroOMS,
        GV.validateOMSTotalNDR,
      ],
    }),
  ];

  return errorArray;
};

export const validationFunctions = [APMCHValidation];
