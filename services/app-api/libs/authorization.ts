import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { UserRoles, RequestMethods } from "../types";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state"?: string;
}

export const isAuthorized = (event: APIGatewayProxyEvent) => {
  if (!event.headers["X-Api-Key"]) return false;

  // get state and method from the event
  const requestState = event.pathParameters?.state;
  const requestMethod = event.httpMethod as RequestMethods;

  // decode the idToken
  const decoded = jwt_decode(event.headers["X-Api-Key"]) as DecodedToken;

  // get the role / state from the decoded token
  const userRole = decoded["custom:cms_roles"];
  const userState = decoded["custom:cms_state"];

  // if user is a state user - check they are requesting a resource from their state
  if (userState && requestState && userRole === UserRoles.STATE) {
    return userState.toLowerCase() === requestState.toLowerCase();
  }

  // if user is an admin - they can only GET resources
  return requestMethod === RequestMethods.GET;
};
