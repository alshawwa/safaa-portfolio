
import { useEffect } from "react";
import { api } from "./services/api";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { LanguageProvider } from "@/context/LanguageContext";
import { Home } from "@/pages/Home";
import { ProjectDetails } from "@/pages/ProjectDetails";

import { Login } from "@/pages/admin/Login";
import { Dashboard } from "@/pages/admin/Dashboard";
import { AdminGuard } from "@/components/AdminGuard";

export default function App() {
  useEffect(() => {
    api.getProfile()
      .then((data) => console.log("Profile API:", data))
      .catch((error) => console.error("API Error:", error));
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/projects/:slug"
            element={<ProjectDetails />}
          />

          <Route path="/admin/login" element={<Login />} />

          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
