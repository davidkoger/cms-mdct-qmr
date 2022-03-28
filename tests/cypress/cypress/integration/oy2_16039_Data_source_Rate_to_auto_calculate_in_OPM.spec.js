import testConfig from "../../test-config.js";
const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

describe("OY2 16039 Data source/ Rate to auto calculate in OPM", () => {
  beforeEach(() => {
    // Seed database with test data
    cy.visit("/");
    cy.xpath(emailForCognito).type(testConfig.TEST_USER_2);
    cy.xpath(passwordForCognito).type(testConfig.TEST_PASSWORD_1);
    cy.get('[data-cy="login-with-cognito-button"]').click();
  });

  it("Check Auto Calculation with Administrative Data", () => {
    cy.get('[data-cy="ACS"]').click();
    cy.xpath("//p[contains(text(),'FUA-AD')]").click();
    cy.wait(2000);
    cy.get(`[data-cy="Clear Data"]`).click();
    cy.wait(2000);
    cy.xpath("//p[contains(text(),'FUA-AD')]").click();
    cy.get(
      '[data-cy="DataSource0"] > .chakra-checkbox__label > .chakra-text'
    ).click({ force: true });
    cy.get("#MeasurementSpecification-Other").click({ force: true });
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]'
    ).clear({ force: true });
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]').type(
      "1"
    );
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).type("2");
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').click();
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').should(
      "have.attr",
      "aria-readonly",
      "true"
    );
  });
  it("Check Auto Calculation with Other", () => {
    cy.get('[data-cy="ACS"]').click();
    cy.xpath("//p[contains(text(),'FUA-AD')]").click();
    cy.wait(2000);
    cy.xpath("//button[contains(text(),'Clear Data')]").click();
    cy.wait(2000);
    cy.xpath("//p[contains(text(),'FUA-AD')]").click();
    cy.get("#MeasurementSpecification-Other").click({ force: true });
    cy.get(
      '[data-cy="DataSource1"] > .chakra-checkbox__label > .chakra-text'
    ).click({ force: true });
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]'
    ).clear({ force: true });
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]').type(
      "1"
    );
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).type("2");
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').click();
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').click();
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').clear();
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').type(
      "60"
    );
  });
  it("Check Auto Calculation with Administrative Data and Other", () => {
    cy.get('[data-cy="ACS"]').click();
    cy.xpath("//p[contains(text(),'FUA-AD')]").click();
    cy.wait(2000);
    cy.xpath("//button[contains(text(),'Clear Data')]").click();
    cy.wait(2000);
    cy.xpath("//p[contains(text(),'FUA-AD')]").click();
    cy.get("#MeasurementSpecification-Other").click({ force: true });
    cy.get(
      '[data-cy="DataSource0"] > .chakra-checkbox__label > .chakra-text'
    ).click({ force: true });
    cy.get(
      '[data-cy="DataSource1"] > .chakra-checkbox__label > .chakra-text'
    ).click({ force: true });
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]'
    ).clear({ force: true });
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]').type(
      "1"
    );
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).type("2");
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').clear();
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').type(
      "60"
    );
  });
});
