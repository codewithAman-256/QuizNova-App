import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import AchievementCard from "../components/AchievementCard";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // ✅ Fetch profile data
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data.user);
      setResults(res.data.results);
      setFormData({
        name: res.data.user.name,
        email: res.data.user.email,
      });
    } catch (err) {
      toast.error("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Update Profile
  const handleUpdate = async () => {
    try {
      const res = await api.put("/profile", formData);
      toast.success("Profile updated successfully 🎉");

      // ✅ Update local state instantly (no need to reload page)
      setProfile(res.data.user);
      setEditMode(false);

      // ✅ Optionally update AuthContext & localStorage user info
      if (setUser) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="p-8 min-h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>

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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p>
            <strong>Name:</strong> {profile?.name}
          </p>
          <p>
            <strong>Email:</strong> {profile?.email}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Edit
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8">📊 Quiz Results</h2>
      <ul className="mt-2 space-y-1">
        {results.map((r) => (
          <li key={r._id}>
            Quiz: {r.quizTitle} | Score: {r.percentage}%
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-8">🏆 Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AchievementCard title="First Quiz" unlocked={results.length >= 1} />
        <AchievementCard
          title="Quiz Master (Score 80%)"
          unlocked={results.some((r) => r.percentage >= 80)}
        />
        <AchievementCard
          title="Consistency Star"
          unlocked={results.length >= 5}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
