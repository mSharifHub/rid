import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function NavigationHandler() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authStatus === "authenticated" && location.pathname === "/auth") {
      navigate("/dashboard");
    }
  }, [authStatus, location.pathname, navigate]);
  return null;
}
