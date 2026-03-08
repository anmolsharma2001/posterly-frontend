// export default function StatsCard({ icon, label, value, color = '#4f46e5', subtitle }) {
//   return (
//     <div
//       className="rounded-2xl p-5 flex items-start gap-4 fade-in bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50"
//     >
//       <div
//         className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-lg relative overflow-hidden"
//         style={{ backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)` }}
//       >
//         <div className="absolute inset-0 bg-white/20"></div>
//         <span className="relative z-10">{icon}</span>
//       </div>
//       <div>
//         <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
//         <p className="text-slate-800 text-3xl font-bold leading-none">{value}</p>
//         {subtitle && <p className="text-slate-400 opacity-80 text-xs mt-1">{subtitle}</p>}
//       </div>
//     </div>
//   );
// }

export default function StatsCard({ icon, label, value, color, bgColor }) {
  return (
    <div
      className="rounded-3xl p-6 backdrop-blur-xl border border-white/40 shadow-lg flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-xl"
      style={{ backgroundColor: bgColor }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
        style={{
          backgroundColor: color,
          color: "#fff",
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-white text-xs font-semibold uppercase tracking-wider">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
}