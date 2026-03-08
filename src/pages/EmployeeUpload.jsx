import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyToken, uploadImage, getImageUrl } from '../services/api';
import ImagePreview from '../components/ImagePreview';
import { format } from 'date-fns';

function StatusBadge({ status }) {
  const styles = {
    uploaded: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80', icon: '✅', label: 'Image Uploaded' },
    carriedForward: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', icon: '📂', label: 'Carried Forward' },
    notUploaded: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', icon: '⏳', label: 'No Image Yet' },
  };
  const s = styles[status] || styles.notUploaded;
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm" style={{ background: s.bg, color: s.text }}>
      {s.icon} {s.label}
    </span>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <span className="text-lg w-8 text-center">{icon}</span>
      <div>
        <p className="text-muted text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-heading text-sm font-semibold mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function EmployeeUpload() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState('loading'); // loading | invalid | ready | uploading | success | error
  const [employee, setEmployee] = useState(null);
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setState('invalid'); return; }
    verifyToken(token)
      .then(res => { setEmployee(res.data.employee); setState('ready'); })
      .catch(() => setState('invalid'));
  }, [token]);

  const handleUpload = async () => {
    if (!file) return;
    setState('uploading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImage(formData, token);
      setEmployee(res.data.employee);
      setFile(null);
      setState('success');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Upload failed. Please try again.');
      setState('error');
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-muted font-medium">Verifying your link...</p>
        </div>
      </div>
    );
  }

  // ── Invalid Token ─────────────────────────────────────────────────────────
  if (state === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full text-center rounded-2xl p-8 fade-in bg-surface border border-border shadow-sm">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-heading mb-2">Link Expired or Invalid</h2>
          <p className="text-muted text-sm leading-relaxed">This magic link has expired or is invalid. Please contact your HR team to receive a new upload link.</p>
        </div>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (state === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full text-center rounded-2xl p-8 fade-in bg-surface border border-border shadow-sm">
          <div className="text-6xl mb-4 pulse-ring inline-block">🎉</div>
          <h2 className="text-xl font-bold text-heading mb-2">Photo Uploaded!</h2>
          <p className="text-muted text-sm mb-6 leading-relaxed">Your photo has been saved and will be used for your poster.</p>
          {employee?.currentImage && (
            <img
              src={getImageUrl(employee.currentImage)}
              alt={employee.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-md border-4 border-white"
            />
          )}
          <p className="text-heading font-semibold text-lg">{employee?.name}</p>
          <button
            onClick={() => setState('ready')}
            className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary transition-all bg-primary/5 hover:bg-primary/10 border border-primary/20"
          >
            Replace Photo
          </button>
        </div>
      </div>
    );
  }

  // ── Main Upload Page ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-lg w-full fade-in z-10">

        {/* Header card */}
        <div className="rounded-2xl p-6 mb-4 bg-surface border border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 accent-gradient opacity-80"></div>
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl accent-gradient shadow-sm text-white">
              🎉
            </div>
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-0.5">Poster Asset Portal</p>
              <h1 className="text-heading font-bold text-xl tracking-tight">Upload Your Photo</h1>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border mb-4">
            <h2 className="text-heading text-lg font-bold">{employee?.name}</h2>
            <StatusBadge status={employee?.imageStatus} />
          </div>

          <div className="px-1">
            <InfoRow icon="📧" label="Email Address" value={employee?.email} />
            <InfoRow icon="🎂" label="Birthday" value={employee?.birthday ? format(new Date(employee.birthday), 'dd MMMM') : null} />
            <InfoRow icon="🗓️" label="Joining Date" value={employee?.joiningDate ? format(new Date(employee.joiningDate), 'dd MMM yyyy') : null} />
            {employee?.lastImageUpdateDate && (
              <InfoRow icon="🖼️" label="Last Upload" value={format(new Date(employee.lastImageUpdateDate), 'dd MMM yyyy, HH:mm')} />
            )}
          </div>
        </div>

        {/* Upload card */}
        <div className="rounded-2xl p-6 bg-surface border border-border shadow-sm">
          <h3 className="text-heading font-bold text-lg mb-4 tracking-tight">
            {employee?.currentImage ? 'Replace Your Photo' : 'Upload Your Photo'}
          </h3>

          <div className="p-4 rounded-xl bg-background border border-border mb-4">
            <ImagePreview
              file={file}
              onFileSelect={setFile}
              currentImageUrl={employee?.currentImage ? getImageUrl(employee.currentImage) : null}
              uploading={state === 'uploading'}
            />
          </div>

          {state === 'error' && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm fade-in bg-red-50 border border-red-200">
              <span className="text-red-500">✗ {errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || state === 'uploading'}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 accent-gradient disabled:hover:translate-y-0"
          >
            {state === 'uploading' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Uploading...
              </span>
            ) : file ? '⬆ Upload Photo' : 'Select a photo to continue'}
          </button>

          <p className="text-muted text-xs text-center mt-4">
            Accepted formats: JPG, PNG, WEBP · Max size: 10MB · Only one photo is stored
          </p>
        </div>

      </div>
    </div>
  );
}
