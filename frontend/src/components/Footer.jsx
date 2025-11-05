import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white mt-16">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">QuizNova ⚡</h2>
          <p className="text-sm text-gray-100 leading-relaxed">
            The next-gen quiz platform to test your skills, track growth, and
            earn achievements. Learn smart, play smarter!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-yellow-300 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/quizList" className="hover:text-yellow-300 transition">
                Quizzes
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-yellow-300 transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-yellow-300 transition">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Social + Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Connect</h3>
          <div className="flex gap-4 mb-3">
            <a
              href="https://github.com/codewithAman-256"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300 transition"
            >
              <Github size={22} />
            </a>
            <a
              href="https://linkedin.com/in/aman-baloch-028819251/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300 transition"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="mailto:balochaman256@gmail.com"
              className="hover:text-yellow-300 transition"
            >
              <Mail size={22} />
            </a>
          </div>
          <p className="text-sm text-gray-100">
            Made with ❤️ by <span className="font-semibold">Aman Baloch</span>
          </p>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-white/20"></div>

      {/* Bottom Section */}
      <div className="text-center py-4 text-sm text-gray-200">
        © {new Date().getFullYear()} QuizNova. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
