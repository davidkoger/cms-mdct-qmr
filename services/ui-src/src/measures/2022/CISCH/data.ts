import { DataDrivenTypes } from "measures/2022/CommonQuestions/types";
import * as DC from "dataConstants";

export const qualifiers = [
  "DTaP",
  "IPV",
  "MMR",
  "HiB",
  "Hep B",
  "VZV",
  "PCV",
  "Hep A",
  "RV",
  "Flu",
  "Combo 3",
  "Combo 7",
  "Combo 10",
];
export const categories = [];

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Percentage of children age 2 who had four diphtheria, tetanus and acellular pertussis (DTaP); three polio (IPV); one measles, mumps and rubella (MMR); three haemophilus influenza type B (HiB); three hepatitis B (Hep B), one chicken pox (VZV); four pneumococcal conjugate (PCV); one hepatitis A (HepA); two or three rotavirus (RV); and two influenza (flu) vaccines by their second birthday. The measure calculates a rate for each vaccine and three separate combination rates.",
  ],
  questionListItems: [],
  categories,
  qualifiers,
};

export const dataSourceData: DataDrivenTypes.DataSource = {
  optionsLabel:
    "If reporting entities (e.g., health plans) used different data sources, please select all applicable data sources used below.",
  options: [
    {
      value: DC.ADMINISTRATIVE_DATA,
      subOptions: [
        {
          label: "What is the Administrative Data Source?",
          options: [
            {
              value: DC.MEDICAID_MANAGEMENT_INFO_SYSTEM,
            },
            {
              value: DC.IMMUNIZATION_REGISTRY,
            },
            {
              value: DC.ADMINISTRATIVE_DATA_OTHER,
              description: true,
            },
          ],
        },
      ],
    },
    {
      value: DC.HYBRID_DATA,
      subOptions: [
        {
          label: "What is the Administrative Data Source?",
          options: [
            {
              value: DC.MEDICAID_MANAGEMENT_INFO_SYSTEM,
            },
            {
              value: DC.IMMUNIZATION_REGISTRY,
            },
            {
              value: DC.ADMINISTRATIVE_DATA_OTHER,
              description: true,
            },
          ],
        },
        {
          label: "What is the Medical Records Data Source?",
          options: [
            {
              value: DC.EHR_DATA,
            },
            {
              value: DC.PAPER,
            },
          ],
        },
      ],
    },
    {
      value: DC.ELECTRONIC_HEALTH_RECORDS,
      description: true,
    },
    {
      value: DC.OTHER_DATA_SOURCE,
      description: true,
    },
  ],
};
