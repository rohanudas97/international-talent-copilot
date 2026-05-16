import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    visaType: "F1",
    graduationDate: "",
    targetRole: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      // Create user account
      await axios.post("http://localhost:8080/auth/signup", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      // Create user profile
      await axios.post(
        "http://localhost:8080/profile/me",
        {
          fullName: form.fullName,
          email: form.email,
          visaType: form.visaType,
          graduationDate: form.graduationDate,
          targetRole: form.targetRole,
        },
        {
          headers: {
            Authorization: `Bearer ${form.email}`,
          },
        }
      );

      // Auto-login
      localStorage.setItem("token", form.email);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center p-8">
      <div className="bg-slate-950 rounded-3xl border border-white/10 p-8 w-full max-w-md">
        <h1 className="text-3xl font-black mb-6 text-center">Sign Up</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
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
              required
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
              required
              placeholder="e.g., Software Engineer"
              className="mt-1 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none"
            />
          </div>
          <button className="w-full rounded-2xl bg-blue-600 py-3 font-bold">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-slate-400">
          Already have an account? <a href="/login" className="text-blue-300">Login</a>
        </p>
      </div>
    </div>
  );
}

