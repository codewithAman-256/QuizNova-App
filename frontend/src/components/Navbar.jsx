import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; // ✅ Make sure path is correct

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            QuizNova
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/quizList" className="hover:text-blue-600 font-medium">
              Quizzes
            </Link>
            {user?.role === "admin" && (
              <Link 
              to="/admin"
              className="hover:text-blue-600 font-medium"
              >Admin Dashboard</Link>
            )}
            <Link to="/dashboard" className="hover:text-blue-600 font-medium">
              Dashboard
            </Link>

            {user ? (
              <>
                <span className="font-medium text-gray-700">
                  👋 {user.name || "User"}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col items-center space-y-3 py-4">
            <Link to="/"
            className="hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/quizList" 
            className="hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}>
              Quizzes
            </Link>
            {user?.role === "admin" && (
              <Link 
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600 font-medium"
              >Admin Dashboard</Link>
            )}
            <Link to="/dashboard" onClick={() => setIsOpen(false)}
            className="hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>

            {user ? (
              <>
                <span className=" font-medium">
                  👋 {user.name || "User"}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
