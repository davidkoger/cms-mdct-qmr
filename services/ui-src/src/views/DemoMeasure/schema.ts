import Joi from "joi";
import { DemoForm } from "./DemoFormType";

export const validationSchema = Joi.object<DemoForm.DemoFormType>({
  DidReport: Joi.string().label("Are you reporting"),
  DataStatus: Joi.string().label("Status of Data Reported"),
  DataSource: Joi.array().items(Joi.string()),
  "DataStatus-ProvisionalExplanation": Joi.string(),
  "DataSource-Administrative": Joi.array().items(Joi.string()),
  "DataSource-Administrative-Other": Joi.string(),
  "DataSource-Administrative-Other-Explanation": Joi.string(),
  "DataSource-Other": Joi.string(),
  "DataSource-Other-Explanation": Joi.string(),
  "DataSource-Hybrid": Joi.array().items(Joi.string()),
  "DataSource-Hybrid-Other": Joi.string(),
  "DataSource-Hybrid-Other-Explanation": Joi.string(),
  "DataSource-Hybrid-MedicalRecord-DataSoruce": Joi.string(),
  "DataSource-ElectronicHealthRecords": Joi.string(),
  "DataSource-ElectronicHealthRecords-Explanation": Joi.string(),
  WhyAreYouNotReporting: Joi.array().items(Joi.string()),
  AmountOfPopulationNotCovered: Joi.string(),
  PartialPopulationNotCoveredExplanation: Joi.string(),
  WhyIsDataNotAvailable: Joi.array().items(Joi.string()),
  "WhyIsDataNotAvailable-Other": Joi.string(),
  DataIconAccuracyIssues: Joi.string(),
  DataSourceNotEasilyAccessible: Joi.array().items(Joi.string()),
  "DataSourceNotEasilyAccessible-Other": Joi.string(),
  InformationNotCollected: Joi.array().items(Joi.string()),
  "InformationNotCollected-Other": Joi.string(),
  LimitationWithDatCollecitonReportAccuracyCovid: Joi.string(),
  SmallSampleSizeLessThan30: Joi.string(),
  "WhyAreYouNotReporting-Other": Joi.string(),
  "AdditionalNotes-AdditionalNotes": Joi.string(),
  "AdditionalNotes-Upload": Joi.array().items(Joi.any()),
});
