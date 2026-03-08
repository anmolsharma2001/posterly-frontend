import { useState, useRef } from 'react';
import { importCsv } from '../services/api';
import { Upload } from 'lucide-react';

export default function CSVUpload({ onSuccess }) {
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setStatus('loading');
    setResult(null);

    try {
      const res = await importCsv(formData);
      setResult(res.data);
      setStatus('success');
      if (onSuccess) onSuccess();
      
      // Auto-hide success message after 7 seconds
      setTimeout(() => {
        setStatus(null);
        setResult(null);
      }, 7000);
    } catch (err) {
      setResult({ error: err.response?.data?.message || 'Import failed' });
      setStatus('error');
      
      // Auto-hide error message after 7 seconds
      setTimeout(() => {
        setStatus(null);
        setResult(null);
      }, 7000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-500/5"
        style={{ borderColor: "#334155" }}
      >
        {/* <span className="text-xl">📊</span> */}
        <Upload size={20} />
        <div>
          <span className="text-slate-800 text-sm font-medium">
            Import CSV File
          </span>
          <p className="text-slate-500 text-xs">
            Columns: name, email, birthday, joiningDate
          </p>
        </div>
        <button
          type="button"
          className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-500 transition-colors"
          style={{
            background: "rgba(79,70,229,0.15)",
            border: "1px solid rgba(79,70,229,0.3)",
          }}
        >
          {status === "loading" ? "Importing..." : "Browse CSV"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {status === "success" && result && (
        <div
          className="rounded-xl px-4 py-3 text-sm fade-in"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <p className="text-green-400 font-medium">✓ Import complete</p>
          <p className="text-slate-400 mt-1">
            {result.imported} imported · {result.alreadyAdded || 0} already added · {result.skipped} skipped ·{" "}
            {result.errors?.length || 0} errors
          </p>
          {result.errors?.length > 0 && (
            <ul className="mt-2 text-xs text-red-400 list-disc list-inside bg-red-50 p-2 rounded max-h-32 overflow-y-auto w-full">
              {result.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {status === "error" && result && (
        <div
          className="rounded-xl px-4 py-3 text-sm fade-in"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <p className="text-red-400 font-medium">✗ {result.error}</p>
        </div>
      )}
    </div>
  );
}

