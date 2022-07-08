import { omsValidations } from "./index";
import {
  locationDictionary,
  generateOmsQualifierRateData,
  simpleRate,
  generateOmsFormData,
} from "utils/testUtils/validationHelpers";
import { DefaultFormData } from "measures/2022/CommonQuestions/types";
import { OMSData } from "measures/2022/CommonQuestions/OptionalMeasureStrat/data";

describe("Testing OMS validation processor", () => {
  const categories = ["Test Cat 1", "Test Cat 2"];
  const qualifiers = ["Test Qual 1", "Test Qual 2"];

  test("should have no errors for basic data", () => {
    const errors = omsValidations({
      categories,
      qualifiers,
      locationDictionary,
      dataSource: [],
      data: generateOmsFormData(
        generateOmsQualifierRateData(categories, qualifiers, [
          simpleRate,
          simpleRate,
        ])
      ) as DefaultFormData,
      validationCallbacks: [],
    });

    expect(errors.length).toBe(0);
  });

  test("should have no errors for basic data - no ACA", () => {
    const errors = omsValidations({
      categories,
      qualifiers,
      locationDictionary,
      dataSource: [],
      data: generateOmsFormData(
        generateOmsQualifierRateData(categories, qualifiers, [
          simpleRate,
          simpleRate,
        ]),
        true,
        OMSData(false)
      ) as DefaultFormData,
      validationCallbacks: [],
    });

    expect(errors.length).toBe(0);
  });

  test("should have no errors for no data", () => {
    const errors = omsValidations({
      categories,
      qualifiers,
      locationDictionary,
      dataSource: [],
      data: generateOmsFormData(
        generateOmsQualifierRateData(categories, qualifiers, [
          simpleRate,
          simpleRate,
        ]),
        false
      ) as DefaultFormData,
      validationCallbacks: [],
    });

    expect(errors.length).toBe(0);
  });

  test("should have errors for not filling data into selected checkboxes", () => {
    const errors = omsValidations({
      categories,
      qualifiers,
      locationDictionary,
      dataSource: [],
      checkIsFilled: true,
      data: generateOmsFormData(
        generateOmsQualifierRateData(categories, qualifiers, [{}, {}]),
        true
      ) as DefaultFormData,
      validationCallbacks: [],
    });

    expect(errors.length).toBe(134);
    expect(
      errors.some((e) =>
        e.errorMessage.includes("Must fill out at least one NDR set.")
      )
    );
    expect(
      errors.some((e) =>
        e.errorMessage.includes(
          "For any category selected, all NDR sets must be filled."
        )
      )
    );
  });

  test("should have errors from callbacks for every node", () => {
    const errors = omsValidations({
      categories,
      qualifiers,
      locationDictionary,
      dataSource: [],
      data: generateOmsFormData(
        generateOmsQualifierRateData(categories, qualifiers, [
          simpleRate,
          simpleRate,
        ])
      ) as DefaultFormData,
      validationCallbacks: [
        () => {
          return [
            { errorLocation: "TestLocation", errorMessage: "TestMessage" },
          ];
        },
      ],
    });

    expect(errors.length).toBe(74);
  });
});
