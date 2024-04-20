import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { UserProvider } from "./user_state_management/UserProvider";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
);
