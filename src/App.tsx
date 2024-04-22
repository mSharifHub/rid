import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Profile } from "./components/Profile";
import { Dashboard } from "./components/Dashboard";
import "./App.css";
import { PageNotFound } from "./components/PageNotFound";
import { MinLayout } from "./components/MinLayout";
import { MainLayout } from "./components/MainLayout";
import AuthUserComponent from "./components/AuthUserComponent";

import ProtectedRoute from "./ProtectedRoute";

function App() {
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
              <AuthUserComponent />
            </MinLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MinLayout>
                <Profile />
              </MinLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MinLayout>
                <Dashboard />
              </MinLayout>
            </ProtectedRoute>
          }
        />
        {/* Redirect all unmatched routes to the Home page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
