import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import QuizList from "./pages/QuizList.jsx";
import QuizAttempt from "./pages/QuizAttempt.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Footer from "./components/Footer.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import DailyChallengePage from "./pages/DailyChallengePage.jsx";
import { Toaster, toast } from "react-hot-toast";

function AppContent() {
  const { user } = useContext(AuthContext);

  // 🔔 Daily reminder toast (once per day)
  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      toast("🔥 Don’t forget to complete your daily challenge!", {
        icon: "⚡",
        duration: 4000,
      });
      localStorage.setItem("lastVisit", today);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {user?.role === "admin" || user?.role === "superadmin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )}
              </ProtectedRoute>
            }
          />

          <Route path="/daily" element={<DailyChallengePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/quizList" element={<QuizList />} />
          <Route path="/attempt" element={<QuizAttempt />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<Leaderboard />}></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        {/* 🧩 Global toast system */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            success: { style: { background: "#4ade80", color: "#fff" } },
            error: { style: { background: "#f87171", color: "#fff" } },
          }}
        />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
