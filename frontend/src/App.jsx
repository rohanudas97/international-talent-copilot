import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Globe2,
  LogOut,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

const API_BASE = "http://localhost:8080/profile";

const emptyForm = {
  fullName: "",
  email: "",
  visaType: "F1",
  graduationDate: "",
  targetRole: "",
};

export default function App() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileToDelete, setProfileToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [visaFilter, setVisaFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("desc");

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProfiles();
  }, [page, visaFilter, sortBy, direction]);

  async function fetchProfiles() {
    try {
      let url = "";

      if (visaFilter === "ALL") {
        url = `${API_BASE}/paged?page=${page}&size=6&sortBy=${sortBy}&direction=${direction}`;
      } else {
        url = `${API_BASE}/filter?visaType=${visaFilter}&page=${page}&size=6&sortBy=${sortBy}&direction=${direction}`;
      }

      const response = await axios.get(url);
      setProfiles(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function openCreateDrawer() {
    setEditingProfile(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  }

  function openEditDrawer(profile) {
    setEditingProfile(profile);
    setForm({
      fullName: profile.fullName,
      email: profile.email,
      visaType: profile.visaType,
      graduationDate: profile.graduationDate,
      targetRole: profile.targetRole,
    });
    setDrawerOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingProfile) {
        await axios.put(`${API_BASE}/${editingProfile.id}`, form);
      } else {
        await axios.post(API_BASE, form);
      }

      setDrawerOpen(false);
      setEditingProfile(null);
      setForm(emptyForm);
      fetchProfiles();
    } catch (error) {
      alert(error.response?.data?.message || "Request failed");
    }
  }

  async function handleDeleteConfirmed() {
    await axios.delete(`${API_BASE}/${profileToDelete.id}`);
    setProfileToDelete(null);
    fetchProfiles();
  }

  async function handleStatusChange(id, status) {
    await axios.patch(`${API_BASE}/${id}/status?status=${status}`);
    fetchProfiles();
  }

  const visibleProfiles = profiles.filter((profile) =>
    `${profile.fullName} ${profile.email} ${profile.visaType} ${profile.targetRole}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">International Talent Copilot</h1>
            <p className="text-slate-400">
              Full lifecycle talent management dashboard
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={openCreateDrawer}
              className="rounded-2xl bg-white text-slate-950 px-5 py-3 font-semibold"
            >
              New Profile
            </button>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-red-600 text-white px-5 py-3 font-semibold flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <MetricCard icon={<Users />} label="Loaded Profiles" value={profiles.length} />
          <MetricCard icon={<CheckCircle2 />} label="Page" value={page + 1} />
          <MetricCard icon={<CalendarDays />} label="Total Pages" value={totalPages} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-5">
          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={visaFilter}
              onChange={(e) => {
                setPage(0);
                setVisaFilter(e.target.value);
              }}
              className="rounded-2xl bg-slate-950 border border-white/10 px-4 py-3"
            >
              <option>ALL</option>
              <option>F1</option>
              <option>OPT</option>
              <option>STEM OPT</option>
              <option>H1B</option>
              <option>Green Card</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl bg-slate-950 border border-white/10 px-4 py-3"
            >
              <option value="id">Newest</option>
              <option value="fullName">Name</option>
              <option value="graduationDate">Graduation Date</option>
              <option value="visaType">Visa Type</option>
            </select>

            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="rounded-2xl bg-slate-950 border border-white/10 px-4 py-3"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-2xl bg-slate-950 border border-white/10 px-4 py-3"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {visibleProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onEdit={() => openEditDrawer(profile)}
                onDelete={() => setProfileToDelete(profile)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="rounded-2xl border border-white/10 px-5 py-3 disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-2xl border border-white/10 px-5 py-3 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </div>

      {drawerOpen && (
        <Drawer
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingProfile={editingProfile}
          close={() => setDrawerOpen(false)}
        />
      )}

      {profileToDelete && (
        <DeleteModal
          profile={profileToDelete}
          cancel={() => setProfileToDelete(null)}
          confirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <div className="mb-4 text-blue-300">{icon}</div>
      <p className="text-slate-400 text-sm">{label}</p>
      <h3 className="text-4xl font-black">{value}</h3>
    </div>
  );
}

function ProfileCard({ profile, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
      <div className="flex justify-between">
        <div>
          <h4 className="text-lg font-bold">{profile.fullName}</h4>
          <p className="text-slate-400 text-sm">{profile.email}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={onEdit}>
            <Pencil size={18} className="text-blue-300" />
          </button>

          <button onClick={onDelete}>
            <Trash2 size={18} className="text-red-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Info label="Visa" value={profile.visaType} icon={<Globe2 size={16} />} />
        <Info label="Role" value={profile.targetRole} icon={<Briefcase size={16} />} />
        <Info label="Graduation" value={profile.graduationDate} icon={<CalendarDays size={16} />} />

        <div className="rounded-2xl bg-white/[0.04] p-3">
          <p className="text-slate-500 text-xs mb-1">Status</p>
          <select
            value={profile.status}
            onChange={(e) => onStatusChange(profile.id, e.target.value)}
            className="bg-transparent w-full font-semibold outline-none"
          >
            <option>ACTIVE</option>
            <option>INACTIVE</option>
            <option>ARCHIVED</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Drawer({ form, handleChange, handleSubmit, editingProfile, close }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-end">
      <aside className="w-full max-w-md bg-slate-950 h-full p-6 border-l border-white/10">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {editingProfile ? "Edit Profile" : "Create Profile"}
          </h2>

          <button onClick={close}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Visa Type" name="visaType" value={form.visaType} onChange={handleChange} />
          <Input label="Graduation Date" type="date" name="graduationDate" value={form.graduationDate} onChange={handleChange} />
          <Input label="Target Role" name="targetRole" value={form.targetRole} onChange={handleChange} />

          <button className="w-full rounded-2xl bg-blue-600 py-3 font-bold">
            {editingProfile ? "Save Changes" : "Create Profile"}
          </button>
        </form>
      </aside>
    </div>
  );
}

function DeleteModal({ profile, cancel, confirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-slate-950 rounded-3xl p-6 border border-white/10 w-full max-w-md">
        <h3 className="text-2xl font-bold">Delete Profile?</h3>
        <p className="text-slate-400 mt-3">{profile.fullName}</p>

        <div className="mt-6 flex gap-3">
          <button onClick={cancel} className="flex-1 border border-white/10 rounded-2xl py-3">
            Cancel
          </button>

          <button onClick={confirm} className="flex-1 bg-red-600 rounded-2xl py-3 font-semibold">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-3">
      <div className="flex gap-2 text-slate-500 text-xs mb-1">
        {icon}
        {label}
      </div>
      <p className="font-semibold truncate">{value}</p>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none"
      />
    </div>
  );
}