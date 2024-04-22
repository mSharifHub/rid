import { ReactNode } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";

interface AuthUserComponentProps {
  children: ReactNode;
}

function AuthUserComponent({ children }: AuthUserComponentProps) {
  return <div>{children}</div>;
}

const AuthUserComponentWithAuthenticator = withAuthenticator(
  AuthUserComponent,
  {
    socialProviders: ["google"],
  },
);

export default AuthUserComponentWithAuthenticator;
