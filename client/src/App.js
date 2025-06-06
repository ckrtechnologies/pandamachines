import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./routes/middleware/AuthLayout";
import NonAuthLayout from "./routes/middleware/NonAuthLayout";
import { authRoutes, nonAuthRoutes, userRoutes } from "./routes/AllRoutes";
import UserLayout from "./routes/middleware/UserLayout";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
const App = () => {
  // Renders authenticated routes
  const renderAuthRoutes = (routes) => {
    return routes.map((route, idx) => (
      <Route
        key={idx}
        path={route.path}
        element={<AuthLayout>{route.component}</AuthLayout>}
      />
    ));
  };

  // Renders non-authenticated routes
  const renderNonAuthRoutes = (routes) => {
    return routes.map((route, idx) => (
      <Route
        key={idx}
        path={route.path}
        element={<NonAuthLayout>{route.component}</NonAuthLayout>}
      />
    ));
  };

  const renderUserRoutes = (routes) => {
    return routes.map((route, idx) => (
      <Route
        key={idx}
        path={route.path}
        element={<UserLayout>{route.component}</UserLayout>}
      />
    ));
  };

  return (
    <React.Fragment>
      <BrowserRouter>
        <AuthProvider>
          <div>
            <Routes>
              {renderNonAuthRoutes(nonAuthRoutes)}
              {renderAuthRoutes(authRoutes)}
              {renderUserRoutes(userRoutes)}
            </Routes>
            <Toaster></Toaster>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
