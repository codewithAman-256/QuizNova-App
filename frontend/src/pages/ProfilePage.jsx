/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import AchievementCard from "../components/AchievementCard";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { requestAdminAccess } from "../utils/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [requesting, setRequesting] = useState(false);

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

  const handleUpdate = async () => {
    try {
      const res = await api.put("/profile", formData);
      setProfile({ ...profile, ...formData });
      setUser((prev) => ({ ...prev, ...formData }));
      setEditMode(false);
      toast.success("Profile updated");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Update failed");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);

    try {
      const res = await api.post("/profile/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      toast.success("Avatar updated");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      toast.error("Avatar upload failed");
    }
  };

  const handleRequestAdmin = async () => {
    if (!profile) return;
    if (profile.adminRequestStatus === "pending") {
      toast("Request already pending", { icon: "ℹ️" });
      return;
    }
    setRequesting(true);
    try {
      await requestAdminAccess();
      // update profile locally to pending for immediate feedback
      setProfile((p) => ({ ...p, adminRequestStatus: "pending" }));
      toast.success("Admin request submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setRequesting(false);
    }
  };

  if (loading)
    return <Loader text="Loading your profile..." />;

  const avgScore = results.length ? (results.reduce((acc, r) => acc + r.score, 0) / results.length) : 0;

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-6 sm:p-10 flex justify-center">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-indigo-100">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700 text-center">👤 My Profile</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img src={profile.avatar || "/default-avatar.png"} alt="avatar" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500" />
            <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-indigo-600 text-white px-2 py-1 rounded-lg cursor-pointer text-sm">Change</label>
            <input id="avatar" type="file" className="hidden" onChange={handleAvatarChange} />
          </div>

          <p className="mt-3 text-orange-500 text-lg font-semibold">🔥 {profile.streakCount || 0}-day streak</p>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-gray-600"><strong>Name:</strong> {profile.name}</p>
            <p className="text-gray-600"><strong>Email:</strong> {profile.email}</p>
            <p className="mt-1">
              <strong>Role:</strong>{" "}
              <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                profile.role === "admin" ? "bg-green-100 text-green-800" : "bg-indigo-100 text-indigo-800"
              }`}>
                {profile.role}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button onClick={() => setEditMode(true)} className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>

            {/* Admin Request Button */}
            <button
              onClick={handleRequestAdmin}
              disabled={profile.adminRequestStatus === "pending" || profile.role === "admin" || requesting}
              className={`mt-1 px-4 py-2 rounded-full text-white transition ${
                profile.role === "admin"
                  ? "bg-gray-400 cursor-not-allowed"
                  : profile.adminRequestStatus === "pending"
                  ? "bg-yellow-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {profile.role === "admin"
                ? "You are Admin"
                : profile.adminRequestStatus === "pending"
                ? "Request Pending"
                : "Request Admin Access"}
            </button>

            {/* Show request status */}
            {profile.adminRequestStatus && profile.adminRequestStatus !== "none" && (
              <p className="text-sm mt-2 text-gray-500 italic">
                Request status:{" "}
                <span className={`font-medium ${
                  profile.adminRequestStatus === "approved"
                    ? "text-green-600"
                    : profile.adminRequestStatus === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}>
                  {profile.adminRequestStatus}
                </span>
              </p>
            )}
          </div>
        </div>

        {editMode ? (
          <div className="space-y-3">
            <input className="border p-2 w-full rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input className="border p-2 w-full rounded" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded border">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {/* Quiz History */}
            <h2 className="text-xl font-semibold mt-6 text-indigo-700">📊 Quiz History</h2>
            {results.length === 0 ? (
              <p className="text-gray-500 mt-2 text-center">No quizzes attempted yet 😅</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {results.map((r) => (
                  <li key={r._id} className="bg-indigo-50 rounded-lg p-3 shadow-sm flex justify-between">
                    <span>{r.quizTitle || "Quiz"}</span>
                    <span className="font-semibold text-blue-600">{r.percentage || r.score * 20}%</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Achievements */}
            <h2 className="text-xl font-semibold mt-8 text-indigo-700">🏆 Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
              <AchievementCard title="First Quiz" unlocked={results.length >= 1} color="bg-green-200 border-green-400" />
              <AchievementCard title="Quiz Master (Score ≥ 80%)" unlocked={results.some((r) => r.score >= 80)} color="bg-yellow-200 border-yellow-400" />
              <AchievementCard title="Consistency Star (5+ Quizzes)" unlocked={results.length >= 5} color="bg-blue-200 border-blue-400" />
              <AchievementCard title="Bronze Badge (≥ 50%)" unlocked={avgScore >= 50} color="bg-amber-200 border-amber-500" />
              <AchievementCard title="Silver Badge (≥ 70%)" unlocked={avgScore >= 70} color="bg-gray-300 border-gray-500" />
              <AchievementCard title="Gold Badge (≥ 90%)" unlocked={avgScore >= 90} color="bg-yellow-300 border-yellow-500" />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
