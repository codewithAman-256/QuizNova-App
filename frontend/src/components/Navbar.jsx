import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Trophy } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              QuizNova
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/quizList"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Quizzes
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>

              {/* Admin Link */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Admin
                </Link>
              )}

              {/* Profile Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600"
                  >
                    👋 {user.name || "User"}
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        👤 Profile
                      </Link>
                      <Link
                        to="/leaderboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        🏆 Leaderboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    🔐 Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all"
                  >
                    👤 Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
            <div className="flex flex-col items-center space-y-4 py-5">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/quizList"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Quizzes
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                🏆 Leaderboard
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Admin
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    👋 {user.name || "User"}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Floating Leaderboard Button (Mobile) */}
      <Link
        to="/leaderboard"
        className="fixed bottom-6 right-6 bg-linear-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all md:hidden"
      >
        <Trophy size={22} />
      </Link>
    </>
  );
};

export default Navbar;
