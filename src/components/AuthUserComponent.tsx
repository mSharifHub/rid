// import { ReactNode } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";

function AuthUserComponent() {
  return <div></div>;
}

const AuthUserComponentWithAuthenticator = withAuthenticator(
  AuthUserComponent,
  {
    socialProviders: ["google"],
  },
);

export default AuthUserComponentWithAuthenticator;
