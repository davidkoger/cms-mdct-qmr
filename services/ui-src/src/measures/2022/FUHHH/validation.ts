import * as DC from "dataConstants";
import * as GV from "measures/2022/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "measures/2022/CommonQuestions/OptionalMeasureStrat/data";

const FUHHHValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const dateRange = data[DC.DATE_RANGE];
  const DefinitionOfDenominator = data[DC.DEFINITION_OF_DENOMINATOR];
  const deviationArray = GV.getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const OPM = data[DC.OPM_RATES];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const sixtyDaysIndex = 2;
  const validateDualPopInformationArray = [performanceMeasureArray?.[1]];
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  let sameDenominatorError = [
    ...GV.validateEqualQualifierDenominatorsPM(
      performanceMeasureArray,
      ageGroups
    ),
  ];
  sameDenominatorError =
    sameDenominatorError.length > 0 ? [...sameDenominatorError] : [];
  errorArray = [
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...GV.validateAtLeastOneDataSource(data),

    // Performance Measure Validations
    ...GV.validateDualPopInformationPM(
      validateDualPopInformationArray,
      OPM,
      sixtyDaysIndex,
      DefinitionOfDenominator
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      performanceMeasureArray,
      PMD.qualifiers,
      deviationArray,
      didCalculationsDeviate
    ),
    ...GV.validateNumeratorsLessThanDenominatorsPM(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...sameDenominatorError,
    ...GV.validateNoNonZeroNumOrDenomPM(
      performanceMeasureArray,
      OPM,
      ageGroups,
      data
    ),
    ...GV.validateTotalNDR(performanceMeasureArray),
    ...GV.validateOneCatRateHigherThanOtherCatPM(data, PMD.data),

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
        GV.validateOneCatRateHigherThanOtherCatOMS(),
        GV.validateRateZeroOMS,
        GV.validateRateNotZeroOMS,
        GV.validateOMSTotalNDR,
      ],
    }),
  ];

  return errorArray;
};

export const validationFunctions = [FUHHHValidation];
