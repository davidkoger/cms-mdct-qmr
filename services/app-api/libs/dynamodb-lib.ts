import AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";

const dyanmoConfig: AWS.DynamoDB.DocumentClient.DocumentClientOptions &
  ServiceConfigurationOptions &
  AWS.DynamoDB.ClientApiVersions = {};

// ugly but OK, here's where we will check the environment
const endpoint = process.env.DYNAMODB_URL;
if (endpoint) {
  dyanmoConfig.endpoint = endpoint;
  dyanmoConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
  dyanmoConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
} else {
  dyanmoConfig["region"] = "us-east-1";
}

const client = new AWS.DynamoDB.DocumentClient(dyanmoConfig);

export default {
  get: (params: any) => client.get(params).promise(),
  put: (params: any) => client.put(params).promise(),
  post: (params: any) => client.put(params).promise(),
  query: (params: any) => client.query(params).promise(),
  scan: (params: any) => client.scan(params).promise(),
  update: (params: any) => client.update(params).promise(),
  delete: (params: any) => client.delete(params).promise(),
};