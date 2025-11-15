import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  requestAdminAccess,
} from "../utils/api";
import AchievementCard from "../components/AchievementCard";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [requesting, setRequesting] = useState(false);

  // ====================== Fetch Profile =====================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data.user);
        setResults(data.results || []);

        setFormData({
          name: data.user.name,
          email: data.user.email,
        });
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ====================== Update Profile =====================
  const handleUpdate = async () => {
    try {
      // Update UI instantly (fix editMode not closing issue)
      setProfile((prev) => ({
        ...prev,
        name: formData.name,
        email: formData.email,
      }));

      setUser((prev) => ({
        ...prev,
        name: formData.name,
        email: formData.email,
      }));

      await updateProfile(formData);

      toast.success("Profile updated!");
      setEditMode(false);
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ====================== Upload Avatar =====================
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await uploadAvatar(file);

      setProfile((prev) => ({ ...prev, avatar: data.avatar }));
      setUser((prev) => ({ ...prev, avatar: data.avatar }));
      toast.success("Avatar updated!");
    } catch (err) {
      toast.error("Failed to upload avatar.");
    }
  };

  // ====================== Request Admin Access =====================
  const handleRequestAdmin = async () => {
    if (!profile) return;

    if (profile.role !== "user") {
      toast("You already have admin privileges!", { icon: "ℹ️" });
      return;
    }

    if (profile.adminRequestStatus === "pending") {
      toast("Your request is already pending!", { icon: "ℹ️" });
      return;
    }

    setRequesting(true);
    try {
      await requestAdminAccess();
      setProfile((p) => ({ ...p, adminRequestStatus: "pending" }));
      toast.success("Request sent to admin!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <Loader text="Loading your profile..." />;

  const avgScore =
    results.length > 0
      ? results.reduce((acc, r) => acc + r.score, 0) / results.length
      : 0;

  // ====================== UI =====================
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-6 sm:p-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-6 sm:p-8 border border-indigo-100"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          👤 My Profile
        </h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
            />

            <label
              htmlFor="avatar"
              className="absolute bottom-1 right-1 px-2 py-1 text-xs rounded-lg bg-indigo-600 text-white cursor-pointer opacity-80 group-hover:opacity-100 transition"
            >
              Change
            </label>
            <input
              id="avatar"
              type="file"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <p className="mt-3 text-orange-500 text-lg font-semibold">
            🔥 {profile.streakCount || 0}-day streak
          </p>
        </div>

        {/* Profile Information */}
        <div className="mb-6 flex justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-gray-700">
              <strong>Name:</strong> {profile.name || formData.name}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {profile.email || formData.email}
            </p>

            <p className="mt-1">
              <strong>Role:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.role === "admin" || profile.role === "superadmin"
                    ? "bg-green-100 text-green-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {profile.role}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setEditMode(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
            >
              Edit
            </button>

            <button
              onClick={handleRequestAdmin}
              disabled={
                requesting ||
                profile.role !== "user" ||
                profile.adminRequestStatus === "pending"
              }
              className={`px-4 py-2 rounded-lg text-white shadow transition ${
                profile.role !== "user"
                  ? "bg-gray-400 cursor-not-allowed"
                  : profile.adminRequestStatus === "pending"
                  ? "bg-yellow-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {profile.role === "superadmin"
                ? "Superadmin"
                : profile.role === "admin"
                ? "Admin"
                : profile.adminRequestStatus === "pending"
                ? "Pending..."
                : "Request Admin Access"}
            </button>
          </div>
        </div>

        {/* Edit Mode */}
        {editMode ? (
          <div className="space-y-4 mt-4">
            <input
              className="border p-3 w-full rounded-xl focus:ring-indigo-500 focus:ring-2 outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              className="border p-3 w-full rounded-xl focus:ring-indigo-500 focus:ring-2 outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-5 py-2 rounded-xl border"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Quiz History */}
            <h2 className="text-xl font-semibold mt-6 text-indigo-700">
              📊 Quiz History
            </h2>

            {results.length === 0 ? (
              <p className="text-gray-500 mt-2 text-center">
                No quizzes attempted yet 😅
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {results.map((r) => (
                  <li
                    key={r._id}
                    className="bg-white border border-indigo-100 p-4 rounded-xl shadow flex justify-between"
                  >
                    <span>{r.quizTitle || "Quiz"}</span>
                    <span className="font-bold text-indigo-600">
                      {r.percentage || r.score * 20}%
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Achievements */}
            <h2 className="text-xl font-semibold mt-8 text-indigo-700">
              🏆 Achievements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <AchievementCard
                title="First Quiz"
                unlocked={results.length >= 1}
                icon="✨"
              />

              <AchievementCard
                title="Quiz Master (≥80%)"
                unlocked={results.some((r) => r.percentage >= 80)}
                icon="🔥"
              />

              <AchievementCard
                title="Consistency Star (5+ Quizzes)"
                unlocked={results.length >= 5}
                icon="📅"
              />

              <AchievementCard
                title="Bronze Badge (≥50%)"
                unlocked={avgScore >= 2.5}
                icon="🥉"
              />

              <AchievementCard
                title="Silver Badge (≥70%)"
                unlocked={avgScore >= 3.5}
                icon="🥈"
              />

              <AchievementCard
                title="Gold Badge (≥90%)"
                unlocked={avgScore >= 4.5}
                icon="🥇"
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
