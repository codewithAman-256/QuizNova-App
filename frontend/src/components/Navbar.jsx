import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Trophy } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* LOGO */}
            <Link
              to="/"
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              QuizNova
            </Link>

            {/* DESKTOP MENU */}
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

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Admin
                </Link>
              )}

              {/* PROFILE DROPDOWN */}
              {user ? (
                <div className="relative">
                  <div
                    onClick={() => setShowMenu(!showMenu)}
                    className="relative cursor-pointer"
                  >
                    {/* STREAK BADGE */}
                    {user.streakCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                        🔥 {user.streakCount}
                      </div>
                    )}

                    {/* USER AVATAR */}
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border-2 border-yellow-400 object-cover hover:scale-105 transition"
                    />
                  </div>

                  {/* DROPDOWN PANEL */}
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg py-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        👤 Profile
                      </Link>

                      <Link
                        to="/daily"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        🎯 Daily Challenge
                      </Link>

                      <Link
                        to="/leaderboard"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
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

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl py-6">
            <div className="flex flex-col items-center space-y-5">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                🏠 Home
              </Link>
              <Link
                to="/quizList"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                🧠 Quizzes
              </Link>
              <Link
                to="/daily"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                🔥 Daily
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                📈 Dashboard
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                🏆 Leaderboard
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  🛠️ Admin Panel
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium"
                  >
                    🙋‍♂️ {user.name}
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium"
                  >
                    🔑 Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-lg"
                  >
                    ✍️ Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* FLOATING LEADERBOARD BUTTON (Mobile) */}
      <Link
        to="/leaderboard"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg md:hidden"
      >
        <Trophy size={22} />
      </Link>
    </>
  );
};

export default Navbar;
