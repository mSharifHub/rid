import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home } from "./components/Home";
import { Profile } from "./components/Profile";
import { Dashboard } from "./components/Dashboard";
import "./App.css";
import { PageNotFound } from "./components/PageNotFound";
import { MinLayout } from "./components/MinLayout";
import { MainLayout } from "./components/MainLayout";
import { useUser } from "./user_state_management/UserContext";
import AuthUser from "./components/AuthUser";
import { Amplify } from "aws-amplify";
import config from "./amplifyconfiguration.json";
Amplify.configure(config);

function App() {
  const { state } = useUser() ?? {};
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/auth"
          element={
            <MinLayout>
              <AuthUser />
            </MinLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MinLayout>
              {state?.isLoggedIn ? <Profile /> : <Navigate to="/" replace />}
            </MinLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MinLayout>
              {state?.isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
            </MinLayout>
          }
        />
        {/* Redirect all unmatched routes to the Home page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
