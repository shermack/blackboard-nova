import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import AnalyticsPage from "../pages/AnalyticsPage";
import AssignmentsPage from "../pages/AssignmentsPage";
import CoursesPage from "../pages/CoursesPage";
import DashboardPage from "../pages/DashboardPage";
import GradingPage from "../pages/GradingPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";

export default function AppRouter({ user, onLogin, onLogout }) {
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AppShell user={user} onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage user={user} />} />
        <Route path="/courses" element={<CoursesPage user={user} />} />
        <Route path="/assignments" element={<AssignmentsPage user={user} />} />
        <Route path="/grading" element={<GradingPage user={user} />} />
        <Route path="/analytics" element={<AnalyticsPage user={user} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}
