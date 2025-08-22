// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

// Material Kit 2 React themes
import theme from "theme";

// Material Kit 2 React routes
import routes from "routes";

// Context providers
import { AuthProvider } from "contexts/AuthContext";

// Layouts
import MainLayout from "layouts/MainLayout";
import DashboardLayout from "layouts/DashboardLayout";

// Pages
import Home from "pages/Home";
import Login from "pages/Auth/Login";
import Register from "pages/Auth/Register";
import ForgotPassword from "pages/Auth/ForgotPassword";
import Dashboard from "pages/Dashboard";
import Certifications from "pages/Dashboard/Certifications";
import CertificationForm from "pages/Dashboard/Certifications/CertificationForm";
import CertificationDetails from "pages/Dashboard/Certifications/CertificationDetails";
import Profile from "pages/Dashboard/Profile";
import Settings from "pages/Dashboard/Settings";
import NotFound from "pages/NotFound";

// Components
import ProtectedRoute from "@/components/common/ProtectedRoute";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/certificates" element={<Certifications />} />
              <Route path="/dashboard/certificates/new" element={<CertificationForm />} />
              <Route path="/dashboard/certificates/:id" element={<CertificationDetails />} />
              <Route path="/dashboard/certificates/:id/edit" element={<CertificationForm />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>

            {/* Not Found */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}