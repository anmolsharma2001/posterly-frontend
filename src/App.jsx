import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import HRDashboard from './pages/HRDashboard';
import DesignerDashboard from './pages/DesignerDashboard';
import EmployeeUpload from './pages/EmployeeUpload';
import ColorfulDashboard from './pages/ColorfulDashboard';
import Login from './pages/Login';
import './index.css';

function Navbar() {
  const role = localStorage.getItem('userRole');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
      <div className="flex items-center gap-3">
        {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br from-cd_purple to-cd_blue shadow-sm shadow-cd_purple/30 text-white">
          🎉
        </div> */}
        <img src="/posterly_favicon.svg" alt="Posterly" className="w-8 h-8" />
        <span className="text-slate-800 font-bold text-base tracking-tight">
          Posterly
        </span>
      </div>
      <div className="flex items-center gap-2">
        {role === "HR" && (
          <NavLink
            to="/hr"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-cd_purple/10 text-cd_purple shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`
            }
          >
            HR Dashboard
          </NavLink>
        )}
        <NavLink
          to="/designer"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-cd_blue/10 text-cd_blue shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`
          }
        >
          Designer View
        </NavLink>
        {/* <NavLink
          to="/colorful"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:text-heading hover:bg-black/5'
            }`
          }
        >
          Colorful UI
        </NavLink> */}
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <span className="text-slate-800 text-sm font-medium">
          Hello, {localStorage.getItem("userName") || "User"}
        </span>
        <button
          onClick={() => {
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            window.location.href = "/login";
          }}
          className="ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('userRole');
  const location = useLocation();

  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect Designer to their own page if trying to access HR dashboard
    return <Navigate to="/designer" replace />;
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '72px' }}>
        {children}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/upload" element={<EmployeeUpload />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/colorful" element={<ColorfulDashboard />} /> */}
        
        {/* Protected Routes */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute allowedRoles={['HR']}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/designer"
          element={
            <ProtectedRoute allowedRoles={['HR', 'Designer']}>
              <DesignerDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Default route based on role */ }
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['HR', 'Designer']}>
              <Navigate to={localStorage.getItem('userRole') === 'Designer' ? '/designer' : '/hr'} replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
