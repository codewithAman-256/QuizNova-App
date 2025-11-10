import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import AchievementCard from "../components/AchievementCard";
import { motion } from "framer-motion";
import Loader from "../components/Loader"; // ✅ custom loader

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setProfile(res.data.user);
        setResults(res.data.results || []);
        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
        });
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Update Profile
  const handleUpdate = async () => {
    try {
      await api.put("/profile", formData);
      setProfile({ ...profile, ...formData });
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // ✅ Avatar Upload (No page reload)
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
    } catch (err) {
      console.error("Avatar upload failed:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader />
      </div>
    );

  const avgScore = results.length
    ? results.reduce((acc, r) => acc + r.score, 0) / results.length
    : 0;

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-6 sm:p-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-indigo-100"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700 text-center">
          👤 My Profile
        </h1>

        {/* ✅ Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
            />
            <label
              htmlFor="avatar"
              className="absolute bottom-0 right-0 bg-indigo-600 text-white px-2 py-1 rounded-lg cursor-pointer text-sm"
            >
              Change
            </label>
            <input
              id="avatar" // ✅ Added id
              type="file"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <p className="mt-3 text-orange-500 text-lg font-semibold">
            🔥 {profile.streakCount || 0}-day streak
          </p>
        </div>

        {/* ✅ Edit / View Mode */}
        {editMode ? (
          <div className="space-y-3">
            <input
              className="border p-2 w-full rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              className="border p-2 w-full rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <div>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        )}

        {/* ✅ Quiz History */}
        <h2 className="text-xl font-semibold mt-8 text-indigo-700">
          📊 Quiz History
        </h2>
        {results.length === 0 ? (
          <p className="text-gray-500 mt-2 text-center">
            No quizzes attempted yet 😅
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {results.map((r) => (
              <li
                key={r._id}
                className="bg-indigo-50 rounded-lg p-3 shadow-sm flex justify-between"
              >
                <span>{r.quizTitle || "Quiz"}</span>
                <span className="font-semibold text-blue-600">
                  {r.percentage || r.score * 20}%
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Achievements */}
        <h2 className="text-xl font-semibold mt-8 text-indigo-700">
          🏆 Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
          <AchievementCard
            title="First Quiz"
            unlocked={results.length >= 1}
            color="bg-green-200 border-green-400"
          />
          <AchievementCard
            title="Quiz Master (Score ≥ 80%)"
            unlocked={results.some((r) => r.score >= 80)}
            color="bg-yellow-200 border-yellow-400"
          />
          <AchievementCard
            title="Consistency Star (5+ Quizzes)"
            unlocked={results.length >= 5}
            color="bg-blue-200 border-blue-400"
          />
          <AchievementCard
            title="Bronze Badge (≥ 50%)"
            unlocked={avgScore >= 50}
            color="bg-amber-200 border-amber-500"
          />
          <AchievementCard
            title="Silver Badge (≥ 70%)"
            unlocked={avgScore >= 70}
            color="bg-gray-300 border-gray-500"
          />
          <AchievementCard
            title="Gold Badge (≥ 90%)"
            unlocked={avgScore >= 90}
            color="bg-yellow-300 border-yellow-500"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
