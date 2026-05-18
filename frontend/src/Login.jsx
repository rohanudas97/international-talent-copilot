import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username: form.email,
        password: form.password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <main className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden border-r border-slate-200 bg-white px-10 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">International Talent Copilot</p>
              <p className="text-xs text-slate-500">Visa-aware career command center</p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium text-blue-700">Secure workspace</p>
            <h1 className="text-5xl font-semibold leading-tight tracking-normal">
              Know your status, next deadline, and next move.
            </h1>
            <div className="mt-10 grid grid-cols-3 gap-3">
              <PreviewStat label="Timeline" value="OPT" />
              <PreviewStat label="Risk" value="Low" />
              <PreviewStat label="Next" value="DSO" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center gap-3">
              <LockKeyhole size={18} className="text-blue-700" />
              <p className="text-sm font-semibold">Protected by JWT authentication</p>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Your dashboard is tied to your verified session, so personal profile actions use your signed token.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <ShieldCheck size={21} />
              </div>
              <h1 className="text-3xl font-semibold">International Talent Copilot</h1>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-7">
                <p className="text-sm font-medium text-slate-500">Welcome back</p>
                <h2 className="mt-1 text-2xl font-semibold">Log in to your workspace</h2>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldLabel label="Email">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </FieldLabel>

                <FieldLabel label="Password">
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </FieldLabel>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
                  Log in
                  <ArrowRight size={18} />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                New here?{" "}
                <Link to="/signup" className="font-semibold text-blue-700 hover:text-blue-800">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PreviewStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function FieldLabel({ label, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}
