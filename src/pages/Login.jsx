import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'HR' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        const { data } = await loginUser({ email: form.email, password: form.password });
        finishAuth(data);
      } else {
        await registerUser({ 
          name: form.name, 
          email: form.email, 
          passwordHash: form.password, 
          role: form.role 
        });
        setIsLogin(true);
        setForm(f => ({ ...f, password: '' }));
        setSuccess('Account created successfully! Please sign in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
    setLoading(false);
  };

  const finishAuth = (userData) => {
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userName', userData.name);
    if (userData.role === 'HR') navigate('/hr');
    else navigate('/designer');
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm text-heading bg-background border border-border outline-none transition-all focus:ring-2 focus:ring-primary/40";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full rounded-2xl p-8 fade-in bg-surface border border-border shadow-sm">
        <div className="flex flex-col items-center mb-6">
          {/* <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 accent-gradient shadow-sm text-white">
            🎉
          </div> */}
          <img src="/posterly_favicon.svg" alt="Posterly" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-heading text-center">
            Posterly
          </h1>
          <p className="text-muted text-sm mt-2 text-center">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-6 bg-background border border-border">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              isLogin
                ? "bg-primary text-white shadow"
                : "text-muted hover:text-heading"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              !isLogin
                ? "bg-primary text-white shadow"
                : "text-muted hover:text-heading"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm fade-in bg-red-50 border border-red-200">
            <span className="text-red-500">✗ {error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm fade-in bg-green-50 border border-green-200">
            <span className="text-green-600">✓ {success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className={inputClass}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className={inputClass}
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                className={inputClass}
              >
                <option value="HR">HR Admin</option>
                <option value="Designer">Designer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 accent-gradient"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
