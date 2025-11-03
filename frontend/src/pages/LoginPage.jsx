import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/users/login", form);
      localStorage.setItem("token", res.data.token);

      // ✅ Show loader briefly for UX smoothness
      setTimeout(() => {
        login(res.data);
        navigate("/");
        setLoading(false);
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-indigo-700">
          Login to <span className="text-indigo-600">QuizNova</span>
        </h2>

        {loading ? (
          <Loader text="Logging you in..." />
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 w-full rounded hover:bg-indigo-700 transition font-medium"
            >
              Login
            </button>
          </form>
        )}

        <p className="text-sm text-center text-gray-600 mt-3">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
