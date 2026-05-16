import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username: form.email,
        password: form.password,
      });
      localStorage.setItem("token", response.data.token); // Store token
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center p-8">
      <div className="bg-slate-950 rounded-3xl border border-white/10 p-8 w-full max-w-md">
        <h1 className="text-3xl font-black mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button className="w-full rounded-2xl bg-blue-600 py-3 font-bold">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-slate-400">
          Don't have an account? <a href="/signup" className="text-blue-300">Sign up</a>
        </p>
      </div>
    </div>
  );
}