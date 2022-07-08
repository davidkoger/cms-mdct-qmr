import * as CUI from "@chakra-ui/react";
import * as Types from "measures/2022/CommonQuestions/types";
import * as QMR from "components";
import { PerformanceMeasureData } from "measures/2022/CommonQuestions/PerformanceMeasure/data";
import { PCRRate } from "components/PCRRate";
import { useCustomRegister } from "hooks/useCustomRegister";
import { useWatch } from "react-hook-form";

interface Props {
  data: PerformanceMeasureData;
  rateReadOnly?: boolean;
  calcTotal?: boolean;
  rateScale?: number;
  customMask?: RegExp;
}

interface NdrSetProps {
  categories?: string[];
  qualifiers?: string[];
  rateReadOnly: boolean;
  calcTotal: boolean;
  rateScale?: number;
  customMask?: RegExp;
}

/** Maps over the categories given and creates rate sets based on the qualifiers, with a default of one rate */
const CategoryNdrSets = ({
  rateReadOnly,
  categories = [],
  qualifiers,
  rateScale,
  customMask,
}: NdrSetProps) => {
  const register = useCustomRegister();

  return (
    <>
      {categories.map((item) => {
        let rates: QMR.IRate[] | undefined = qualifiers?.map((cat, idx) => ({
          label: cat,
          id: idx,
        }));

        rates = rates?.length ? rates : [{ id: 0 }];

        const cleanedName = item.replace(/[^\w]/g, "");

        return (
          <>
            <CUI.Text key={item} fontWeight="bold" my="5">
              {item}
            </CUI.Text>
            <QMR.Rate
              readOnly={rateReadOnly}
              rates={rates}
              rateMultiplicationValue={rateScale}
              customMask={customMask}
              {...register(`PerformanceMeasure.rates.${cleanedName}`)}
            />
          </>
        );
      })}
    </>
  );
};

/** If no categories, we still need a rate for the PM */
const QualifierNdrSets = ({
  rateReadOnly,
  qualifiers = [],
  customMask,
}: NdrSetProps) => {
  const register = useCustomRegister();

  const rates: QMR.IRate[] = qualifiers.map((item, idx) => ({
    label: item,
    id: idx,
  }));

  return (
    <PCRRate
      rates={rates}
      readOnly={rateReadOnly}
      customMask={customMask}
      {...register("PerformanceMeasure.rates.singleCategory")}
    />
  );
};

/** Creates the NDR sets based on given categories and qualifiers */
const PerformanceMeasureNdrs = (props: NdrSetProps) => {
  let ndrSets;

  if (props.categories?.length) {
    ndrSets = <CategoryNdrSets {...props} />;
  } else if (props.qualifiers?.length) {
    ndrSets = <QualifierNdrSets {...props} />;
  }

  return <CUI.Box key="PerformanceMeasureNdrSets">{ndrSets}</CUI.Box>;
};

/** Data Driven Performance Measure Comp */
export const PCRHHPerformanceMeasure = ({
  data,
  calcTotal = false,
  rateReadOnly,
  rateScale,
  customMask,
}: Props) => {
  const register = useCustomRegister<Types.PerformanceMeasure>();
  const dataSourceWatch = useWatch<Types.DataSource>({ name: "DataSource" }) as
    | string[]
    | undefined;
  const readOnly =
    rateReadOnly ??
    dataSourceWatch?.every((source) => source === "AdministrativeData") ??
    true;

  return (
    <QMR.CoreQuestionWrapper label="Performance Measure">
      <CUI.Text mb={5}>{data.questionText}</CUI.Text>
      {data.questionListItems && (
        <CUI.UnorderedList m="5" ml="10" spacing={5}>
          {data.questionListItems.map((item, idx) => {
            return (
              <CUI.ListItem key={`performanceMeasureListItem.${idx}`}>
                {data.questionListTitles?.[idx] && (
                  <CUI.Text display="inline" fontWeight="600">
                    {data.questionListTitles?.[idx]}
                  </CUI.Text>
                )}
                {item}
              </CUI.ListItem>
            );
          })}
        </CUI.UnorderedList>
      )}
      <CUI.Text>
        For Health Home enrollees ages 18 to 64, states should also report the
        rate of enrollees who are identified as outliers based on high rates of
        inpatient and observation stays during the measurement year. Data are
        reported in the following categories:
      </CUI.Text>
      <CUI.UnorderedList m="5" ml="10" spacing={5}>
        {[
          "Count of Enrollees in Health Home Population",
          "Number of Outliers",
        ].map((item, idx) => {
          return (
            <CUI.ListItem key={`performanceMeasureListItem.${idx}`}>
              {data.questionListTitles?.[idx] && (
                <CUI.Text display="inline" fontWeight="600">
                  {data.questionListTitles?.[idx]}
                </CUI.Text>
              )}
              {item}
            </CUI.ListItem>
          );
        })}
      </CUI.UnorderedList>
      <QMR.TextArea
        label="If this measure has been reported by the state previously and there has been a substantial change in the rate or measure-eligible population, please provide any available context below:"
        {...register("PerformanceMeasure.explanation")}
      />
      <CUI.Text
        fontWeight="bold"
        mt={5}
        data-cy="Enter a number for the numerator and the denominator"
      >
        Enter values below:
      </CUI.Text>
      <PerformanceMeasureNdrs
        categories={data.categories}
        qualifiers={data.qualifiers}
        rateReadOnly={readOnly}
        calcTotal={calcTotal}
        rateScale={rateScale}
        customMask={customMask}
      />
    </QMR.CoreQuestionWrapper>
  );
};
