import { Measure } from "./types";
import {
  atLeastOneRateComplete,
  validateDualPopInformation,
  validateNumeratorsLessThanDenominators,
  validateEqualDenominators,
  validateNoNonZeroNumOrDenom,
} from "../../globalValidations/validationsLib";

// // The AOM totals Numerator needs to be equal or greater than the largest initiation/engagement
const validateTotalsEqualOrGreaterThan = (
  initiationArray: any[],
  engagementArray: any[],
  totalInitiation: any,
  totalEngagement: any,
  ageGroups: string[]
) => {
  let error = false;
  let errorArray: any[] = [];
  ageGroups.forEach((ageGroup, i) => {
    let initiationError = false;
    let engagementError = false;
    initiationArray.forEach((_initObj, index) => {
      if (
        initiationArray[index] &&
        initiationArray[index][i] &&
        initiationArray[index][i].numerator
      ) {
        if (
          !(totalInitiation[i] && totalInitiation[i].numerator) ||
          initiationArray[index][i].numerator > totalInitiation[i].numerator
        ) {
          engagementError = true;
          error = true;
        }
      }
    });
    engagementArray.forEach((_engageObj, index) => {
      if (
        initiationArray[index] &&
        initiationArray[index][i] &&
        initiationArray[index][i].numerator
      ) {
        if (
          !(totalEngagement[i] && totalEngagement[i].numerator) ||
          initiationArray[index][i].numerator > totalEngagement[i].numerator
        ) {
          error = true;
          engagementError = true;
        }
      }
    });
    if (initiationError) {
      errorArray.push({
        errorLocation: "Performance Measure",
        errorMessage: `Numerator for Initiation of AOD Treatment: AOD Abuse or Dependence must be greater than or equal to the highest number in its sub-categories for ${ageGroup}`,
      });
    }
    if (engagementError) {
      errorArray.push({
        errorLocation: "Performance Measure",
        errorMessage: `Numerator for Initiation of AOD Treatment: AOD Abuse or Dependence must be greater than or equal to the highest number in its sub-categories for ${ageGroup}`,
      });
    }
  });
  return error ? errorArray : [];
};

const IEDValidation = (data: Measure.Form) => {
  const ageGroups = ["Ages 18 to 64", "Age 65 and Older"];
  const age65PlusIndex = 1;
  const OPM = data["OtherPerformanceMeasure-Rates"];
  const performanceMeasureArray = [
    data["PerformanceMeasure-AgeRates-Initiation-Alcohol"],
    data["PerformanceMeasure-AgeRates-Engagement-Alcohol"],
    data["PerformanceMeasure-AgeRates-Initiation-Opioid"],
    data["PerformanceMeasure-AgeRates-Engagement-Opioid"],
    data["PerformanceMeasure-AgeRates-Initiation-Other"],
    data["PerformanceMeasure-AgeRates-Engagement-Other"],
    data["PerformanceMeasure-AgeRates-Initiation-Total"],
    data["PerformanceMeasure-AgeRates-Engagement-Total"],
  ];
  const DefinitionOfDenominator = data["DefinitionOfDenominator"];

  const initiationArray = [
    data["PerformanceMeasure-AgeRates-Initiation-Alcohol"],
    data["PerformanceMeasure-AgeRates-Initiation-Opioid"],
    data["PerformanceMeasure-AgeRates-Initiation-Other"],
  ];
  const engagementArray = [
    data["PerformanceMeasure-AgeRates-Engagement-Alcohol"],
    data["PerformanceMeasure-AgeRates-Engagement-Opioid"],
    data["PerformanceMeasure-AgeRates-Engagement-Other"],
  ];
  const totalInitiation = data["PerformanceMeasure-AgeRates-Initiation-Total"];
  const totalEngagement = data["PerformanceMeasure-AgeRates-Engagement-Total"];
  let errorArray: any[] = [];
  //@ts-ignore
  errorArray = [
    ...errorArray,
    ...atLeastOneRateComplete(performanceMeasureArray, OPM, ageGroups),
    ...validateDualPopInformation(
      performanceMeasureArray,
      age65PlusIndex,
      DefinitionOfDenominator
    ),
    ...validateNumeratorsLessThanDenominators(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...validateEqualDenominators(performanceMeasureArray, ageGroups),
    ...validateTotalsEqualOrGreaterThan(
      initiationArray,
      engagementArray,
      totalInitiation,
      totalEngagement,
      ageGroups
    ),
    ...validateNoNonZeroNumOrDenom(performanceMeasureArray, OPM, ageGroups),
  ];

  return errorArray;
};

export const validationFunctions = [IEDValidation];
