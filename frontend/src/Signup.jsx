import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

const passwordRule =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const passwordHelp =
  "Use at least 8 characters with uppercase, lowercase, number, and special character.";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    visaType: "F1",
    programEndDate: "",
    targetRole: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError("");
    if (!passwordRule.test(form.password)) {
      setError(passwordHelp);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8080/auth/signup", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      const loginResponse = await axios.post("http://localhost:8080/auth/login", {
        username: form.email,
        password: form.password,
      });

      const token = loginResponse.data.token;
      localStorage.setItem("token", token);

      await axios.post(
        "http://localhost:8080/profile/me",
        {
          fullName: form.fullName,
          email: form.email,
          visaType: form.visaType,
          graduationDate: form.programEndDate,
          programEndDate: form.programEndDate,
          targetRole: form.targetRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <main className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[0.92fr_1.08fr]">
        <section className="hidden border-r border-slate-200 bg-slate-950 px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">International Talent Copilot</p>
              <p className="text-xs text-slate-400">Built around your visa track</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-medium text-blue-300">Personalized from day one</p>
            <h1 className="max-w-lg text-5xl font-semibold leading-tight tracking-normal">
              Start with your profile. Leave with a plan.
            </h1>
            <div className="mt-10 space-y-3">
              <PlanLine title="F1" detail="OPT filing window and DSO checklist" />
              <PlanLine title="OPT" detail="Work authorization and unemployment-day tracking" />
              <PlanLine title="H1B" detail="Renewal timeline and employer-change awareness" />
            </div>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-400">
            The first version uses structured rules. AI can later explain the plan, draft messages, and guide job search.
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-xl">
            <div className="mb-7 lg:hidden">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <ShieldCheck size={21} />
              </div>
              <h1 className="text-3xl font-semibold">International Talent Copilot</h1>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-7">
                <p className="text-sm font-medium text-slate-500">Create account</p>
                <h2 className="mt-1 text-2xl font-semibold">Set up your visa workspace</h2>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <Field label="Full Name">
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </Field>

                <Field label="Visa Type">
                  <select
                    name="visaType"
                    value={form.visaType}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option>F1</option>
                    <option>OPT</option>
                    <option>STEM OPT</option>
                    <option>H1B</option>
                    <option>Green Card</option>
                  </select>
                </Field>

                <Field label="Program End Date">
                  <input
                    type="date"
                    name="programEndDate"
                    value={form.programEndDate}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </Field>

                <Field label="Target Role">
                  <input
                    type="text"
                    name="targetRole"
                    value={form.targetRole}
                    onChange={handleChange}
                    required
                    placeholder="Software Engineer"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </Field>

                <Field label="Password">
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}"
                      title={passwordHelp}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                  <div className="mt-2 flex items-center gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-1.5 flex-1 rounded-full ${
                          index < passwordStrength.score ? passwordStrength.color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{passwordHelp}</p>
                </Field>

                <button
                  disabled={isSubmitting}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 md:col-span-2"
                >
                  {isSubmitting ? "Creating workspace..." : "Create workspace"}
                  <ArrowRight size={18} />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z\d]/.test(password)) score += 1;

  return {
    score,
    color: score >= 4 ? "bg-emerald-500" : score >= 3 ? "bg-blue-500" : "bg-amber-500",
  };
}

function PlanLine({ title, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{detail}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}
