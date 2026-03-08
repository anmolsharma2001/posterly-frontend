import { useState, useEffect, useCallback, useRef } from 'react';
import { getUpcomingEvents, getDownloadUrl, getImageUrl, uploadFinalPoster } from '../services/api';
import { format, differenceInDays } from 'date-fns';
import { Cake, Download, Eye, Glasses, Loader2, PartyPopper, RefreshCw, Search, Upload } from 'lucide-react';

const STATUS_STYLES = {
  uploaded: { bg: 'rgba(77,214,194,0.15)', text: '#0e7490', label: 'Uploaded' }, // Teal
  carriedForward: { bg: 'rgba(77,168,255,0.15)', text: '#1e40af', label: 'Carried Fwd' }, // Blue
  notUploaded: { bg: 'rgba(255,184,107,0.15)', text: '#9a3412', label: 'Not Uploaded' }, // Orange
};

const OCCASION_STYLES = {
  Birthday: {
    icon: <Cake size={14} />,
    bg: "rgba(108,99,255,0.15)",
    text: "#5b54d6",
  }, // Purple
  Anniversary: {
    icon: <PartyPopper size={14} />,
    bg: "rgba(77,168,255,0.15)",
    text: "#1e40af",
  }, // Blue
};

function UrgencyBadge({ date }) {
  const days = differenceInDays(new Date(date), new Date());
  // Red/Pink for urgent, Orange for medium, Teal for fine
  const color = days <= 3 ? '#FF6FAF' : days <= 7 ? '#FFB86B' : '#4DD6C2';
  return (
    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full ml-2 shadow-sm" style={{ background: `${color}20`, color }}>
      {days === 0 ? 'Today!' : `${days}d`}
    </span>
  );
}

export default function DesignerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterOccasion, setFilterOccasion] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [days, setDays] = useState(30);
  const [sortKey, setSortKey] = useState('occasionDate');
  const [sortDir, setSortDir] = useState('asc');

  const [uploadingFor, setUploadingFor] = useState(null); // `${empId}-${occasion}`
  const fileInputRef = useRef(null);
  const [targetEvent, setTargetEvent] = useState(null); // { empId, occasion }

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUpcomingEvents(days);
      setEvents(res.data);
    } catch (e) { /* handle */ }
    setLoading(false);
  }, [days]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !targetEvent) return;

    const { empId, occasion } = targetEvent;
    setUploadingFor(`${empId}-${occasion}`);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadFinalPoster(empId, occasion, formData);
      alert('Final poster uploaded successfully!');
      loadData();
    } catch (err) {
      alert('Failed to upload poster: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingFor(null);
      setTargetEvent(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filtered = events
    .filter(e => {
      const name = e.employee?.name?.toLowerCase() || '';
      const matchSearch = name.includes(search.toLowerCase());
      const matchOccasion = filterOccasion === 'All' || e.occasion === filterOccasion;
      const matchStatus = filterStatus === 'All' || e.employee?.imageStatus === filterStatus;
      return matchSearch && matchOccasion && matchStatus;
    })
    .sort((a, b) => {
      let va = a[sortKey] || a.employee?.[sortKey] || '';
      let vb = b[sortKey] || b.employee?.[sortKey] || '';
      if (sortKey === 'occasionDate') { va = new Date(va); vb = new Date(vb); }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const thStyle = {
    background: "#6EC8FF",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };
  const SortIcon = ({ col }) => <span className="ml-1 text-xs opacity-50">{sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>;

  return (
    <div className="min-h-screen p-6 bg-cd_lavender">
      <div className="max-w-7xl mx-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf"
        />

        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Designer Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Upcoming birthdays & anniversaries with poster image downloads
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 fade-in">
          <div className="relative">
            {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10">
              🔍
            </span> */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
            <input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl text-sm text-slate-800 bg-white/80 backdrop-blur-sm border border-slate-200 outline-none focus:ring-2 focus:ring-cd_purple/40 w-56 shadow-sm"
            />
          </div>

          <select
            value={filterOccasion}
            onChange={(e) => setFilterOccasion(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 outline-none shadow-sm focus:ring-2 focus:ring-cd_purple/40"
          >
            <option value="All">All Occasions</option>
            <option value="Birthday">🎂 Birthday</option>
            <option value="Anniversary">🥂 Anniversary</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 outline-none shadow-sm focus:ring-2 focus:ring-cd_purple/40"
          >
            <option value="All">All Statuses</option>
            <option value="uploaded">Uploaded</option>
            <option value="carriedForward">Carried Forward</option>
            <option value="notUploaded">Not Uploaded</option>
          </select>

          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 outline-none shadow-sm focus:ring-2 focus:ring-cd_purple/40"
          >
            <option value={7}>Next 7 days</option>
            <option value={14}>Next 14 days</option>
            <option value={30}>Next 30 days</option>
            <option value={60}>Next 60 days</option>
            <option value={90}>Next 90 days</option>
          </select>

          <div className="ml-auto flex items-center px-5 py-3 rounded-xl text-sm font-bold text-slate-500 bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm">
            {filtered.length} events found
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl overflow-hidden fade-in bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {[
                    { key: "employee.name", label: "Employee" },
                    { key: "occasion", label: "Occasion" },
                    { key: "occasionDate", label: "Date" },
                    { key: "yearsCount", label: "Years" },
                    { key: "employee.imageStatus", label: "Image Status" },
                    { key: null, label: "Assets & Final Output" },
                  ].map(({ key, label }) => (
                    <th
                      key={label}
                      className="px-6 py-4 text-left cursor-pointer select-none whitespace-nowrap border-b border-slate-100"
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
                      colSpan={6}
                      className="py-16 text-center text-slate-500 font-medium"
                    >
                      Loading events...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-slate-500 font-medium"
                    >
                      No upcoming events in the next {days} days
                    </td>
                  </tr>
                ) : (
                  filtered.map((evt) => {
                    const emp = evt.employee;
                    const occ =
                      OCCASION_STYLES[evt.occasion] || OCCASION_STYLES.Birthday;
                    const st =
                      STATUS_STYLES[emp.imageStatus] ||
                      STATUS_STYLES.notUploaded;
                    return (
                      <tr
                        key={`${emp._id}-${evt.occasion}`}
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
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                            style={{ background: occ.bg, color: occ.text }}
                          >
                            {occ.icon} {evt.occasion}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm font-medium whitespace-nowrap">
                          {format(new Date(evt.occasionDate), "dd MMM yyyy")}
                          <UrgencyBadge date={evt.occasionDate} />
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {evt.yearsCount != null ? (
                            <span className="font-bold text-slate-800">
                              {evt.yearsCount}y
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {/* <span
                            className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                            style={{ background: st.bg, color: st.text }}
                          >
                            {st.label}
                          </span> */}
                          <span
                            className="inline-flex items-center justify-center min-w-[120px] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
                            style={{ background: st.bg, color: st.text }}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {emp.currentImage ? (
                              <a
                                href={getDownloadUrl(emp._id)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs  shadow-md shadow-cd_teal/30 bg-gradient-to-br from-cd_teal to-[#7CE5D6] text-slate-800 hover:shadow-lg"
                              >
                                <Download size={14} />
                                Original Image
                              </a>
                            ) : (
                              <span className="text-slate-800 text-xs font-medium">
                                No image
                              </span>
                            )}

                            <button
                              disabled={
                                uploadingFor === `${emp._id}-${evt.occasion}`
                              }
                              onClick={() => {
                                setTargetEvent({
                                  empId: emp._id,
                                  occasion: evt.occasion,
                                });
                                if (fileInputRef.current)
                                  fileInputRef.current.click();
                              }}
                              className="inline-flex items-center justify-center min-w-[130px] gap-1.5 px-4 py-2 rounded-xl text-xs  shadow-md shadow-cd_blue/30 bg-gradient-to-br from-cd_blue to-[#6EC8FF] text-slate-800 disabled:opacity-50 disabled:hover:translate-y-0 hover:shadow-lg"
                            >
                              {/* {uploadingFor === `${emp._id}-${evt.occasion}`
                                ? "⏳..."
                                : emp.finalPosters?.[evt.occasion]
                                ? "🔄 Re-upload Poster"
                                : "⬆ Upload Poster"} */}
                              {uploadingFor === `${emp._id}-${evt.occasion}` ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  Uploading
                                </>
                              ) : emp.finalPosters?.[evt.occasion] ? (
                                <>
                                  <RefreshCw size={14} />
                                  Re-upload Poster
                                </>
                              ) : (
                                <>
                                  <Upload size={14} />
                                  Upload Poster
                                </>
                              )}
                            </button>
                            {emp.finalPosters?.[evt.occasion] && (
                              <a
                                href={getImageUrl(
                                  emp.finalPosters[evt.occasion]
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs  shadow-md shadow-cd_pink/30 bg-gradient-to-br from-cd_pink to-[#FF92C2] text-slate-800 hover:shadow-lg"
                              >
                                <Eye size={14} />
                                View Final
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
