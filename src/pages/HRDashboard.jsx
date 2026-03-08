import { useState, useEffect, useCallback } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  sendBulkEmail,
  sendReminders,
  getStats,
  getImageUrl,
} from "../services/api";
// ...
import StatsCard from "../components/StatsCard";
import CSVUpload from "../components/CSVUpload";
import { format, formatDate, parseISO, isValid } from "date-fns";
import { Users, Image, FolderSync, Clock, UserPlus, Mail, Bell, Search, Pencil, Trash2, User, CalendarDays, Save, X, Calendar } from "lucide-react";

const safeFormatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const parsed = parseISO(dateStr);
    if (!isValid(parsed)) return String(dateStr); // Return raw if can't format
    return format(parsed, "dd MMM yyyy");
  } catch (e) {
    return String(dateStr);
  }
};

const STATUS_STYLES = {
  uploaded: { bg: "rgba(77,214,194,0.15)", text: "#0e7490", label: "Uploaded" }, // Teal
  carriedForward: {
    bg: "rgba(77,168,255,0.15)",
    text: "#1e40af",
    label: "Carried Forward",
  }, // Blue
  notUploaded: {
    bg: "rgba(255,184,107,0.15)",
    text: "#9a3412",
    label: "Not Uploaded",
  }, // Orange
};

// ... keep StatusBadge, Modal, EmployeeForm as is ...

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.notUploaded;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[0.5rem] p-8 fade-in bg-white/90 backdrop-blur-xl border border-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-800 font-bold text-xl tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xl w-8 h-8 flex items-center justify-center rounded-xl transition-all"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// function EmployeeForm({ initial, onSave, onClose }) {
//   const [form, setForm] = useState({
//     name: initial?.name || "",
//     email: initial?.email || "",
//     birthday: initial?.birthday ? initial.birthday.substring(0, 10) : "",
//     joiningDate: initial?.joiningDate
//       ? initial.joiningDate.substring(0, 10)
//       : "",
//   });
//   const [saving, setSaving] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     await onSave(form);
//     setSaving(false);
//   };

//   const inputClass =
//     "w-full px-4 py-3 rounded-xl text-sm text-slate-800 bg-slate-50 border border-slate-200 outline-none transition-all focus:ring-2 focus:ring-cd_purple/40 focus:bg-white placeholder-slate-400";

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-5 ">
//       {[
//         { label: "Full Name", key: "name", type: "text", required: true },
//         { label: "Email", key: "email", type: "email", required: true },
//         { label: "Birthday", key: "birthday", type: "date" },
//         { label: "Joining Date", key: "joiningDate", type: "date" },
//       ].map(({ label, key, type, required }) => (
//         <div key={key}>
//           <label className="block text-slate-500 text-xs font-bold mb-1.5 uppercase tracking-wider ">
//             {label}
//           </label>
//           <input
//             type={type}
//             required={required}
//             value={form[key]}
//             onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
//             className={inputClass}
//           />
//         </div>
//       ))}
//       <div className="flex gap-3 mt-4">
//         <button
//           type="button"
//           onClick={onClose}
//           className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={saving}
//           className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-500 transition-all hover:bg-slate-200 shadow-md shadow-cd_purple/30 bg-gradient-to-br from-cd_purple to-[#8A7CFF] disabled:opacity-50"
//         >
//           {saving ? "Saving..." : "Save Employee"}
//         </button>
//       </div>
//     </form>
//   );
// }

// import { useState } from "react";

const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function EmployeeForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    birthday: formatDateForInput(initial?.birthday),
    joiningDate: formatDateForInput(initial?.joiningDate),
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-800 bg-slate-50 border border-slate-200 outline-none transition-all focus:ring-2 focus:ring-cd_purple/40 focus:bg-white placeholder-slate-400";

  const fields = [
    {
      label: "Full Name",
      key: "name",
      type: "text",
      required: true,
      icon: <User size={16} />,
    },
    {
      label: "Email",
      key: "email",
      type: "email",
      required: true,
      icon: <Mail size={16} />,
    },
    {
      label: "Birthday",
      key: "birthday",
      type: "date",
      icon: <Calendar size={16} />,
    },
    {
      label: "Joining Date",
      key: "joiningDate",
      type: "date",
      icon: <CalendarDays size={16} />,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {fields.map(({ label, key, type, required, icon }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className="text-slate-600 text-xs font-semibold tracking-wide">
            {label}
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>

            <input
              type={type}
              required={required}
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-2">
        {/* <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
        >
          <X size={16} />
          Cancel
        </button> */}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-[#6EC8FF] shadow-md shadow-cd_purple/30 hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Employee"}
        </button>
      </div>
    </form>
  );
}



export default function HRDashboard() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, statsRes] = await Promise.all([
        getEmployees(),
        getStats(),
      ]);
      setEmployees(empRes.data);
      setStats(statsRes.data);
    } catch (e) {
      /* handle */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (form) => {
    if (modal === "add") {
      await createEmployee(form);
    } else {
      await updateEmployee(editTarget._id, form);
    }
    setModal(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    await deleteEmployee(id);
    loadData();
  };

  const handleBulkEmail = async () => {
    setBulkSending(true);
    setBulkResult(null);
    try {
      const res = await sendBulkEmail();
      setBulkResult({ ...res.data, type: "Initial Uploads" });
    } catch (e) {
      setBulkResult({ error: "Failed to send bulk emails" });
    }
    setBulkSending(false);
  };

  const handleSendReminders = async () => {
    setBulkSending(true);
    setBulkResult(null);
    try {
      const res = await sendReminders();
      setBulkResult({ ...res.data, type: "7-Day Reminders" });
    } catch (e) {
      setBulkResult({ error: "Failed to send reminders" });
    }
    setBulkSending(false);
  };

  const filteredEmployees = employees
    .filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va = a[sortKey] || "";
      let vb = b[sortKey] || "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }) => (
    <span className="ml-1 text-xs opacity-50">
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  const thStyle = {
    background: "#6EC8FF",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div className="min-h-screen p-6 bg-cd_lavender">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              HR Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage employees and poster image collection
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setModal("add");
                setEditTarget(null);
              }}
              className="px-5 py-2.5 rounded-xl text-sm  text-slate-800 flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-md shadow-cd_purple/30 bg-[#6EC8FF]"
            >
              <UserPlus size={18} />
              Add Employee
            </button>
            <button
              onClick={handleBulkEmail}
              disabled={bulkSending}
              className="px-5 py-2.5 rounded-xl text-sm  transition-all hover:-translate-y-0.5 flex items-center gap-2 bg-[#FF92C2] text-slate-800 shadow-md shadow-cd_blue/30"
            >
              <Mail size={18} />
              {bulkSending ? "Sending..." : "Initial Uploads"}
            </button>
            <button
              onClick={handleSendReminders}
              disabled={bulkSending}
              className="px-5 py-2.5 rounded-xl text-sm  transition-all hover:-translate-y-0.5 flex items-center gap-2 bg-[#7CE5D6] ttext-slate-500 shadow-md shadow-cd_orange/30"
            >
              <Bell size={18} />
              {bulkSending ? "Sending..." : "Reminders"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Users size={22} />}
            label="Total Employees"
            value={stats.total ?? "—"}
            color="#8A7CFF"
            bgColor="#8A7CFF"
          />
          <StatsCard
            icon={<Image size={22} />}
            label="Images Uploaded"
            value={stats.uploaded ?? "—"}
            color="#4DD6C2"
            bgColor="#4DD6C2"
          />
          <StatsCard
            icon={<FolderSync size={22} />}
            label="Carried Forward"
            value={stats.carriedForward ?? "—"}
            color="#4DA8FF"
            bgColor="#4DA8FF"
          />
          <StatsCard
            icon={<Clock size={22} />}
            label="Pending Uploads"
            value={stats.notUploaded ?? "—"}
            color="#FFB86B"
            bgColor="#FFB86B"
          />
        </div>

        {/* Bulk email result */}
        {bulkResult && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm fade-in"
            style={{
              background: bulkResult.error
                ? "rgba(239,68,68,0.1)"
                : "rgba(34,197,94,0.1)",
              border: `1px solid ${
                bulkResult.error ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"
              }`,
            }}
          >
            {bulkResult.error ? (
              <span className="text-red-400">✗ {bulkResult.error}</span>
            ) : (
              <span className="text-green-400">
                ✓ [{bulkResult.type}] Sent {bulkResult.sent} emails · Failed:{" "}
                {bulkResult.failed}
              </span>
            )}
          </div>
        )}

        {/* Tools bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10">
              🔍
            </span> */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-800 bg-white/80 backdrop-blur-sm border border-slate-200 outline-none focus:ring-2 focus:ring-cd_purple/40 shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px] max-w-sm">
            <CSVUpload onSuccess={loadData} />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl overflow-hidden fade-in bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {[
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "birthday", label: "Birthday" },
                    { key: "joiningDate", label: "Joining Date" },
                    { key: "imageStatus", label: "Image Status" },
                    { key: "lastImageUpdateDate", label: "Last Updated" },
                    { key: null, label: "Actions" },
                  ].map(({ key, label }) => (
                    <th
                      key={label}
                      className="px-6 py-4 text-left cursor-pointer select-none whitespace-nowrap border-b border-slate-100 "
                      style={thStyle}
                      onClick={() => key && handleSort(key)}
                    >
                      {label}
                      {key && <SortIcon col={key} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-slate-500 font-medium"
                    >
                      Loading employees...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-slate-500 font-medium"
                    >
                      {search
                        ? "No employees match your search"
                        : "No employees yet — import a CSV or add manually"}
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, i) => (
                    <tr
                      key={emp._id}
                      className="transition-colors hover:bg-slate-50/80 border-b border-slate-200 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {emp.currentImage ? (
                            <img
                              src={getImageUrl(emp.currentImage)}
                              alt={emp.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm bg-gradient-to-br from-cd_purple to-cd_blue">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-slate-800 text-sm font-bold">
                            {emp.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                        {emp.email}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                        {safeFormatDate(emp.birthday)}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                        {safeFormatDate(emp.joiningDate)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={emp.imageStatus} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                        {safeFormatDate(emp.lastImageUpdateDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditTarget(emp);
                              setModal("edit");
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all hover:scale-105 shadow-sm"
                          >
                            <Pencil size={14} />
                            {/* Edit */}
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all hover:scale-105 shadow-sm"
                          >
                            <Trash2 size={14} />
                            {/* Delete */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredEmployees.length > 0 && (
            <div className="px-6 py-4 text-xs font-bold text-slate-400 bg-slate-50/50 border-t border-slate-100">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {(modal === "add" || modal === "edit") && (
        <Modal
          title={modal === "add" ? "Add Employee" : "Edit Employee"}
          onClose={() => setModal(null)}
        >
          <EmployeeForm
            initial={modal === "edit" ? editTarget : null}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
