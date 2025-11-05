import React, { useContext } from "react";
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

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {user?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )}
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<HomePage />} />
          <Route path="/quizList" element={<QuizList />} />
          <Route path="/attempt" element={<QuizAttempt />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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
      </main>
    <Footer/>
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
