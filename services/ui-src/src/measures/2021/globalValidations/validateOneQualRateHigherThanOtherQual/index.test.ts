import { SINGLE_CATEGORY } from "dataConstants";
import {
  validateOneQualRateHigherThanOtherQualOMS,
  validateOneQualRateHigherThanOtherQualPM,
} from ".";

import {
  generatePmQualifierRateData,
  generateOmsQualifierRateData,
  locationDictionary,
  higherRate,
  lowerRate,
  partialRate,
} from "utils/testUtils/validationHelpers";

describe("Testing Qualifier Rate Higher Than Other Validation", () => {
  const categories = ["Test Cat 1", "Test Cat 2"];
  const qualifiers = ["o_Test Qual 1", "o_Test Qual 2"];
  const singleCat = [SINGLE_CATEGORY];
  const noCat: string[] = [];

  const baseOMSInfo = {
    categories,
    qualifiers,
    locationDictionary,
    isOPM: false,
    label: ["TestLabel"],
  };

  // PM
  describe("PM Validation", () => {
    it("should return no errors", () => {
      const data = generatePmQualifierRateData({ categories, qualifiers }, [
        higherRate,
        lowerRate,
      ]);
      const errors = validateOneQualRateHigherThanOtherQualPM(data, {
        categories,
        qualifiers,
      });

      expect(errors).toHaveLength(0);
    });

    it("should have error", () => {
      const data = generatePmQualifierRateData({ categories, qualifiers }, [
        lowerRate,
        higherRate,
      ]);
      const errors = validateOneQualRateHigherThanOtherQualPM(data, {
        categories,
        qualifiers,
      });

      expect(errors).toHaveLength(2);
      expect(errors[0].errorLocation).toBe("Performance Measure");
      expect(errors[0].errorMessage).toBe(
        `${qualifiers[1]} rate must be less than or equal to ${qualifiers[0]} rate within ${categories[0]}.`
      );
    });

    it("should have error - single category", () => {
      const data = generatePmQualifierRateData(
        { categories: noCat, qualifiers },
        [lowerRate, higherRate]
      );
      const errors = validateOneQualRateHigherThanOtherQualPM(data, {
        categories: noCat,
        qualifiers,
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLocation).toBe("Performance Measure");
      expect(errors[0].errorMessage).toBe(
        `${qualifiers[1]} rate must be less than or equal to ${qualifiers[0]} rate.`
      );
    });

    it("should NOT have error from empty rate value ", () => {
      const data = generatePmQualifierRateData({ categories, qualifiers }, [
        partialRate,
        partialRate,
      ]);
      const errors = validateOneQualRateHigherThanOtherQualPM(data, {
        categories,
        qualifiers,
      });

      expect(errors).toHaveLength(0);
    });

    it("Error message text should match provided errorMessageFunc", () => {
      const errorMessageFunc = (
        lowQual: string,
        highQual: string,
        _notSingleCategory: boolean,
        category: string
      ) => {
        return `Another ${lowQual} bites the ${highQual} and the ${category}.`;
      };

      const data = generatePmQualifierRateData({ categories, qualifiers }, [
        lowerRate,
        higherRate,
      ]);
      const errors = validateOneQualRateHigherThanOtherQualPM(
        data,
        {
          categories,
          qualifiers,
        },
        undefined,
        undefined,
        errorMessageFunc
      );

      expect(errors).toHaveLength(2);
      expect(errors[0].errorLocation).toBe("Performance Measure");
      expect(errors[0].errorMessage).toBe(
        errorMessageFunc(qualifiers[1], qualifiers[0], false, categories[0])
      );
    });
  });

  // OMS
  describe("OMS Validation", () => {
    it("should return no errors", () => {
      const data = generateOmsQualifierRateData(categories, qualifiers, [
        higherRate,
        lowerRate,
      ]);
      const errors = validateOneQualRateHigherThanOtherQualOMS()({
        ...baseOMSInfo,
        rateData: data,
      });

      expect(errors).toHaveLength(0);
    });

    it("should return with no error - isOPM", () => {
      const errors = validateOneQualRateHigherThanOtherQualOMS()({
        ...baseOMSInfo,
        rateData: {},
        isOPM: true,
      });
      expect(errors).toHaveLength(0);
    });

    it("should not show last string portion when OMS has no categories", () => {
      const data = generateOmsQualifierRateData(singleCat, qualifiers, [
        lowerRate,
        higherRate,
      ]);
      const errors = validateOneQualRateHigherThanOtherQualOMS()({
        ...baseOMSInfo,
        categories: singleCat,
        rateData: data,
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].errorMessage).toBe(
        `${qualifiers?.[1]} rate must be less than or equal to ${qualifiers?.[0]} rate.`
      );
    });
  });

  it("Error message text should match provided errorMessageFunc", () => {
    const errorMessageFunc = (
      lowQual: string,
      highQual: string,
      _notSingleCategory: boolean,
      category: string
    ) => {
      return `Another ${lowQual} bites the ${highQual} and the ${category}.`;
    };

    const data = generateOmsQualifierRateData(singleCat, qualifiers, [
      lowerRate,
      higherRate,
    ]);
    const errors = validateOneQualRateHigherThanOtherQualOMS(
      undefined,
      undefined,
      errorMessageFunc
    )({
      ...baseOMSInfo,
      categories: singleCat,
      rateData: data,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].errorMessage).toBe(
      errorMessageFunc(qualifiers[1], qualifiers[0], false, singleCat[0])
    );
  });
});
