import { OmsValidationCallback, FormRateField } from "../types";
import { cleanString } from "utils/cleanString";

export const validateOMSTotalNDR: OmsValidationCallback = ({
  categories,
  qualifiers,
  rateData,
  label,
  locationDictionary,
  isOPM,
  customTotalLabel,
}) => {
  if (isOPM) return [];

  const error: FormError[] = [];

  for (const cat of categories.map((s) => cleanString(s))) {
    const ndrSets = [];
    let numeratorSum: any = null; // initialized as a non-zero value to accurately compare
    let denominatorSum: any = null;
    for (const qual of qualifiers.map((s) => cleanString(s))) {
      ndrSets.push(rateData.rates?.[qual]?.[cat]?.[0]);
    }

    // The last NDR set is the total
    const totalNDR = ndrSets.pop();

    // Calculate numerator and denominator totals
    ndrSets.forEach((set) => {
      if (set && set.denominator && set.numerator && set.rate) {
        numeratorSum += parseFloat(set.numerator);
        denominatorSum += parseFloat(set.denominator);
      }
    });

    if (totalNDR && totalNDR.numerator && totalNDR.denominator) {
      let x;
      if (
        (x = parseFloat(totalNDR.numerator)) !== numeratorSum &&
        numeratorSum !== null &&
        !isNaN(x)
      ) {
        error.push({
          errorLocation: `Optional Measure Stratification: ${locationDictionary(
            [...label, qualifiers.slice(-1)[0]]
          )}`,
          errorMessage: `${
            customTotalLabel ? `${customTotalLabel} ` : ""
          }Total numerator field is not equal to the sum of other numerators.`,
        });
      }
      if (
        (x = parseFloat(totalNDR.denominator)) !== denominatorSum &&
        denominatorSum !== null &&
        !isNaN(x)
      ) {
        error.push({
          errorLocation: `Optional Measure Stratification: ${locationDictionary(
            [...label, qualifiers.slice(-1)[0]]
          )}`,
          errorMessage: `${
            customTotalLabel ? `${customTotalLabel} ` : ""
          }Total denominator field is not equal to the sum of other denominators.`,
        });
      }
    } else if (numeratorSum && denominatorSum) {
      error.push({
        errorLocation: `Optional Measure Stratification: ${locationDictionary([
          ...label,
          qualifiers.slice(-1)[0],
        ])}`,
        errorMessage: `${
          customTotalLabel ? `${customTotalLabel} ` : ""
        }Total must contain values if other fields are filled.`,
      });
    }
  }

  return error;
};

const validateTotalNDRErrorMessage = (qualifier: string, fieldType: string) => {
  return `${qualifier} ${fieldType.toLowerCase()} field is not equal to the sum of other ${fieldType.toLowerCase()}s.`;
};

/*
Validate that the values represented in the Total NDR fields are the sum of the respective non-total fields.
e.g. numerator === sumOfAllOtherNumerators

This validation can be applied for both Performance Measure and OMS sections.
Default assumption is that this is run for Performance Measure unless specified.
*/
export const validateTotalNDR = (
  performanceMeasureArray: FormRateField[][],
  errorLocation = "Performance Measure",
  categories?: string[],
  errorMessageFunc = validateTotalNDRErrorMessage
): FormError[] => {
  let errorArray: FormError[] = [];

  performanceMeasureArray.forEach((ndrSet, idx) => {
    // If this measure has a totalling NDR, the last NDR set is the total.
    let numeratorSum: any = null;
    let denominatorSum: any = null;
    ndrSet.slice(0, -1).forEach((item: any) => {
      if (
        item !== undefined &&
        item !== null &&
        !item["isTotal"] &&
        item.rate
      ) {
        let x;
        if (!isNaN((x = parseFloat(item["numerator"])))) {
          numeratorSum = numeratorSum + x; // += syntax does not work if default value is null
        }
        if (!isNaN((x = parseFloat(item["denominator"])))) {
          denominatorSum = denominatorSum + x; // += syntax does not work if default value is null
        }
      }
    });

    let totalNDR: any = ndrSet[ndrSet.length - 1];
    if (totalNDR?.denominator && totalNDR?.numerator) {
      // If we wanted to get fancy we could offer expected values in here quite easily.

      const parsedNum = parseFloat(totalNDR.numerator ?? "");
      const parsedDen = parseFloat(totalNDR.denominator ?? "");
      if (
        parsedNum !== numeratorSum &&
        numeratorSum !== null &&
        !isNaN(parsedNum)
      ) {
        const qualifier: string =
          (categories && categories[idx]) || totalNDR.label;
        errorArray.push({
          errorLocation: errorLocation,
          errorMessage: errorMessageFunc(qualifier, "Numerator"),
        });
      }
      if (
        parsedDen !== denominatorSum &&
        denominatorSum !== null &&
        !isNaN(parsedDen)
      ) {
        const qualifier: string =
          (categories && categories[idx]) || totalNDR.label;
        errorArray.push({
          errorLocation: errorLocation,
          errorMessage: errorMessageFunc(qualifier, "Denominator"),
        });
      }
    } else if (numeratorSum && denominatorSum) {
      errorArray.push({
        errorLocation: errorLocation,
        errorMessage: `${
          (categories &&
            categories[idx] &&
            `${categories[idx]} - ${totalNDR.label}`) ||
          totalNDR.label
        } must contain values if other fields are filled.`,
      });
    }
  });

  return errorArray;
};
