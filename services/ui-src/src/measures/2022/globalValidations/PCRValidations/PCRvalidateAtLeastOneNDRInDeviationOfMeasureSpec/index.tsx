import * as Types from "measures/2022/CommonQuestions/types";

interface NDRforumla {
  numerator: number;
  denominator: number;
  rateIndex: number;
}

/*
 * If the user indicates that there is a deviation from the measure spec, they must
 * indicate where the deviation is.
 */
export const PCRvalidateAtLeastOneNDRInDeviationOfMeasureSpec = (
  performanceMeasureArray: any,
  ndrFormulas: NDRforumla[],
  deviationArray: Types.DeviationFields[] | any,
  didCalculationsDeviate: boolean
) => {
  let errorArray: FormError[] = [];
  let ndrCount = 0;

  if (didCalculationsDeviate) {
    performanceMeasureArray?.forEach((performanceMeasure: any) => {
      if (performanceMeasure && performanceMeasure.length > 0) {
        ndrFormulas.forEach((ndr: NDRforumla) => {
          if (
            performanceMeasure[ndr.numerator].value &&
            performanceMeasure[ndr.denominator].value &&
            performanceMeasure[ndr.rateIndex].value
          ) {
            ndrCount++;
          }
        });
      }
    });

    let deviationArrayLength = 0;
    deviationArray.forEach((itm: string) => {
      if (itm) deviationArrayLength++;
    });

    if (ndrCount > 0) {
      const atLeastOneDevSection = deviationArrayLength > 0 ? true : false;

      if (!atLeastOneDevSection) {
        errorArray.push({
          errorLocation: "Deviations from Measure Specifications",
          errorMessage:
            "At least one item must be selected and completed (Numerator, Denominator, or Other)",
        });
      }
    }
  }

  return errorArray;
};
