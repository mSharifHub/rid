import { withAuthenticator } from "@aws-amplify/ui-react";
import { FunctionComponent } from "react";

const AuthComponent: FunctionComponent = () => {
  return null;
};

export const Auth = withAuthenticator(AuthComponent, {
  signUpAttributes: ["email"],
  socialProviders: ["google"],
});
