import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";
import { measures } from "../dynamoUtils/measureList";
import { Measure } from "../../types";

export const listMeasures = handler(async (event, context) => {
  const state = event.pathParameters?.state;
  const year = event.pathParameters?.year as string;
  const coreSet = event.pathParameters?.coreSet;

  const params = {
    TableName: process.env.measureTableName!,
    ...convertToDynamoExpression(
      { state: state, year: parseInt(year), coreSet: coreSet },
      "list"
    ),
  };
  const queryValue = await dynamoDb.scan(params);
  queryValue.Items = queryValue?.Items?.map((v) => {
    const measure = measures[parseInt(year)]?.filter(
      (m) => m.measure === (v as Measure)?.measure
    )[0];
    return { ...v, autoCompleted: !!measure?.autocompleteOnCreation };
  });

  return queryValue;
});

export const getMeasure = handler(async (event, context) => {
  const dynamoKey = createCompoundKey(event);
  const params = {
    TableName: process.env.measureTableName!,
    Key: {
      compoundKey: dynamoKey,
      coreSet: event.pathParameters!.coreSet!,
    },
  };
  const queryValue = await dynamoDb.get(params);
  return queryValue;
});

export const getReportingYears = handler(async () => {
  const reportingYears = Object.keys(measures);
  return reportingYears;
});

export const getMeasureListInfo = handler(async () => {
  return measures;
});

export const getFilteredMeasureListInfo = handler(async (event) => {
  console.log(event.pathParameters);
  const state = event.pathParameters?.state;
  const year = event.pathParameters?.year as string;
  const coreSetType = event.pathParameters?.coresetType;

  const tempData = measures[parseInt(year)].filter(
    (m) => m.type === coreSetType
  );
  console.log(tempData);

  return { [year]: tempData };
});
