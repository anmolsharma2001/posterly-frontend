import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImagePreview({ file, onFileSelect, currentImageUrl, uploading }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) onFileSelect(acceptedFiles[0]);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: uploading,
  });

  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
          isDragActive ? 'scale-105' : ''
        } ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
        style={{
          borderColor: isDragActive ? '#4f46e5' : '#334155',
          background: isDragActive ? 'rgba(79,70,229,0.08)' : '#1e293b',
          minHeight: '160px',
        }}
      >
        <input {...getInputProps()} />
        <div className="text-4xl">{isDragActive ? '📂' : '📸'}</div>
        <p className="text-slate-300 font-medium text-center">
          {isDragActive ? 'Drop your image here!' : 'Drag & drop your photo here'}
        </p>
        <p className="text-slate-500 text-sm text-center">
          or click to browse • JPG, PNG, WEBP • Max 10MB
        </p>
        {!uploading && (
          <button
            type="button"
            className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            Choose File
          </button>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="rounded-2xl overflow-hidden border fade-in" style={{ borderColor: '#334155' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#273548' }}>
            <span className="text-green-400 text-sm">✓</span>
            <span className="text-slate-300 text-sm font-medium">New image selected</span>
            <span className="text-slate-500 text-xs ml-auto">{file.name}</span>
          </div>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full object-contain"
            style={{ maxHeight: '320px', background: '#0f172a' }}
          />
        </div>
      )}

      {/* Current image */}
      {!previewUrl && currentImageUrl && (
        <div className="rounded-2xl overflow-hidden border fade-in" style={{ borderColor: '#334155' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#273548' }}>
            <span className="text-blue-400 text-sm">🖼️</span>
            <span className="text-slate-300 text-sm font-medium">Current image on file</span>
          </div>
          <img
            src={currentImageUrl}
            alt="Current"
            className="w-full object-contain"
            style={{ maxHeight: '320px', background: '#0f172a' }}
          />
        </div>
      )}
    </div>
  );
}
