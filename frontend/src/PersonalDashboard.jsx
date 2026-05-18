import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  LogOut,
  Pencil,
  ShieldCheck,
  Target,
} from "lucide-react";

export default function PersonalDashboard() {
  const [profile, setProfile] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  async function fetchProfile() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const [profileResponse, actionPlanResponse] = await Promise.all([
        axios.get("http://localhost:8080/profile/me", config),
        axios.get("http://localhost:8080/profile/me/action-plan", config),
      ]);

      setProfile(profileResponse.data);
      setForm(profileResponse.data);
      setActionPlan(actionPlanResponse.data);
      setError("");
    } catch (err) {
      setError("Profile is not ready yet.");
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = {
        ...form,
        graduationDate: form.graduationDate || form.programEndDate,
        programEndDate: form.programEndDate || form.graduationDate,
      };
      const response = await axios.put("http://localhost:8080/profile/me", payload, config);
      const actionPlanResponse = await axios.get("http://localhost:8080/profile/me/action-plan", config);
      setProfile(response.data);
      setForm(response.data);
      setActionPlan(actionPlanResponse.data);
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
      <Shell>
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <AlertTriangle className="mx-auto text-amber-500" size={32} />
            <h1 className="mt-4 text-xl font-semibold">Profile setup needed</h1>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-6 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
            >
              Create Profile
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  if (!profile || !actionPlan) {
    return (
      <Shell>
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-5">
          <div className="grid w-full gap-4 md:grid-cols-3">
            <SkeletonBlock className="md:col-span-2 h-44" />
            <SkeletonBlock className="h-44" />
            <SkeletonBlock className="h-72" />
            <SkeletonBlock className="md:col-span-2 h-72" />
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                <ShieldCheck size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-500">International Talent Copilot</p>
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-slate-950">
              Welcome back, {firstName(profile.fullName)}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {profile.visaType} track · {profile.targetRole || "Target role not set"} · {profile.status || "ACTIVE"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        <main className="grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-700">Next best action</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal">{actionPlan.nextAction.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    {actionPlan.nextAction.detail}
                  </p>
                </div>
                <StatusPill tone={actionPlan.riskTone} label={actionPlan.riskLabel} />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <SnapshotCard
                  icon={<CalendarDays size={18} />}
                  label={actionPlan.primaryDate.label}
                  value={actionPlan.primaryDate.value}
                />
                <SnapshotCard
                  icon={<Clock3 size={18} />}
                  label={actionPlan.countdown.label}
                  value={actionPlan.countdown.value}
                />
                <SnapshotCard
                  icon={<Target size={18} />}
                  label="Target Role"
                  value={profile.targetRole || "Not set"}
                />
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <Panel title="Important Dates" icon={<CalendarDays size={18} />}>
                <div className="space-y-3">
                  {actionPlan.importantDates.map((item) => (
                    <TimelineItem key={item.label} label={item.label} value={item.value} tone={item.tone} />
                  ))}
                </div>
              </Panel>

              <Panel title="Action Checklist" icon={<CheckCircle2 size={18} />}>
                <div className="space-y-3">
                  {actionPlan.checklist.map((item) => (
                    <ChecklistItem key={item} label={item} />
                  ))}
                </div>
              </Panel>
            </div>

            <Panel title="Risk Alerts" icon={<AlertTriangle size={18} />}>
              <div className="grid gap-3 md:grid-cols-2">
                {actionPlan.alerts.map((alert) => (
                  <AlertCard key={alert.title} title={alert.title} detail={alert.detail} tone={alert.tone} />
                ))}
              </div>
            </Panel>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-medium text-slate-400">Status snapshot</p>
              <h2 className="mt-3 text-2xl font-semibold">{profile.visaType}</h2>
              <div className="mt-6 space-y-3">
                <ProfileLine icon={<GraduationCap size={17} />} label="Program End" value={profile.programEndDate || profile.graduationDate} />
                <ProfileLine icon={<Briefcase size={17} />} label="Role" value={profile.targetRole} />
                <ProfileLine icon={<FileText size={17} />} label="Email" value={profile.email} />
              </div>
            </div>

            <Panel title="Documents" icon={<FileText size={18} />}>
              <div className="space-y-3">
                {actionPlan.documents.map((doc) => (
                  <DocumentItem key={doc} label={doc} />
                ))}
              </div>
            </Panel>
          </aside>
        </main>
      </div>

      {editing && (
        <EditProfileModal
          form={form}
          onChange={handleChange}
          onSubmit={handleSave}
          onClose={() => {
            setForm(profile);
            setEditing(false);
          }}
        />
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="min-h-screen bg-[#f6f7fb] text-slate-950">{children}</div>;
}

function Panel({ title, icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2 text-slate-700">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SnapshotCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-medium uppercase">{label}</p>
      </div>
      <p className="truncate text-xl font-semibold">{value || "Not set"}</p>
    </div>
  );
}

function TimelineItem({ label, value, tone }) {
  const dot = tone === "red" ? "bg-red-500" : tone === "amber" ? "bg-amber-500" : tone === "blue" ? "bg-blue-500" : "bg-slate-400";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <p className="text-sm font-medium text-slate-700">{label}</p>
      </div>
      <p className="text-right text-sm font-semibold">{value || "Not set"}</p>
    </div>
  );
}

function ChecklistItem({ label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-400">
        <CheckCircle2 size={15} />
      </div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
    </div>
  );
}

function AlertCard({ title, detail, tone }) {
  const styles = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[tone] || styles.blue}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 opacity-80">{detail}</p>
    </div>
  );
}

function StatusPill({ tone, label }) {
  const styles = {
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styles[tone] || styles.blue}`}>
      {label}
    </span>
  );
}

function ProfileLine({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/[0.06] p-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold">{value || "Not set"}</p>
      </div>
    </div>
  );
}

function DocumentItem({ label }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Needed</span>
    </div>
  );
}

function EditProfileModal({ form, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Edit profile</h2>
            <p className="mt-1 text-sm text-slate-500">These fields drive your current dashboard plan.</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <Input label="Full Name" name="fullName" value={form.fullName || ""} onChange={onChange} />
          <Input label="Email" name="email" value={form.email || ""} onChange={onChange} />
          <label className="block text-sm font-medium text-slate-700">
            Visa Type
            <select
              name="visaType"
              value={form.visaType || "F1"}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option>F1</option>
              <option>OPT</option>
              <option>STEM OPT</option>
              <option>H1B</option>
              <option>Green Card</option>
            </select>
          </label>
          <Input
            label="Program End Date"
            type="date"
            name="programEndDate"
            value={form.programEndDate || form.graduationDate || ""}
            onChange={onChange}
          />
          <div className="md:col-span-2">
            <Input label="Target Role" name="targetRole" value={form.targetRole || ""} onChange={onChange} />
          </div>

          <button className="mt-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white md:col-span-2">
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse rounded-2xl border border-slate-200 bg-white ${className}`} />;
}

function firstName(name) {
  return name?.trim().split(" ")[0] || "there";
}
