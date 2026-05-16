import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, Pencil } from "lucide-react";

export default function PersonalDashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user's profile when page loads
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  async function fetchProfile() {
    try {
      const response = await axios.get("http://localhost:8080/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      setForm(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load profile. Try creating one.");
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8080/profile/me", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(form);
      setEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/signup")}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black">My Profile</h1>
            <p className="text-slate-400">Your visa & career information</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-red-600 text-white px-5 py-3 font-semibold flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-950 rounded-3xl border border-white/10 p-8">
          {!editing ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                  <p className="text-slate-400">{profile.email}</p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-2xl bg-blue-600 px-4 py-2 flex items-center gap-2"
                >
                  <Pencil size={18} />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-slate-400 text-sm">Visa Type</p>
                  <p className="font-semibold">{profile.visaType}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-slate-400 text-sm">Target Role</p>
                  <p className="font-semibold">{profile.targetRole}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-slate-400 text-sm">Graduation Date</p>
                  <p className="font-semibold">{profile.graduationDate}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-slate-400 text-sm">Status</p>
                  <p className="font-semibold text-green-400">{profile.status}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Visa Type</label>
                <select
                  name="visaType"
                  value={form.visaType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none"
                >
                  <option>F1</option>
                  <option>OPT</option>
                  <option>STEM OPT</option>
                  <option>H1B</option>
                  <option>Green Card</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Graduation Date</label>
                <input
                  type="date"
                  name="graduationDate"
                  value={form.graduationDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Target Role</label>
                <input
                  type="text"
                  name="targetRole"
                  value={form.targetRole}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 rounded-2xl bg-blue-600 py-3 font-bold">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 rounded-2xl bg-slate-800 py-3 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

