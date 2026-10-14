'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ShieldCheck,
  School,
  GraduationCap,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const targetEmail = customEmail || email;
    const targetPassword = customPass || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push(data.redirect);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
    handleLogin(undefined, roleEmail, 'password123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xl shadow-brand-500/25 mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">EduManage</h2>
        <p className="mt-1 text-sm text-slate-400">
          Full-Stack Education & Student Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-700/80">
          {error && (
            <div className="mb-6 p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Quick 1-Click Role Login Cards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                1-Click Instant Demo Login
              </span>
              <span className="text-[11px] text-slate-400">No typing needed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@edumanage.com')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-950/30 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Admin
                  </span>
                </div>
                <p className="text-xs font-bold text-white mt-2">Dr. Vance</p>
                <p className="text-[11px] text-slate-400 truncate">admin@edumanage.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('sarah.jenkins@edumanage.com')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-900/70 border border-blue-500/30 hover:border-blue-500 hover:bg-blue-950/30 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <School className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Teacher
                  </span>
                </div>
                <p className="text-xs font-bold text-white mt-2">Prof. Jenkins</p>
                <p className="text-[11px] text-slate-400 truncate">sarah.jenkins@edumanage.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('student@edumanage.com')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/30 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <GraduationCap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Student
                  </span>
                </div>
                <p className="text-xs font-bold text-white mt-2">Alex Rivera</p>
                <p className="text-[11px] text-slate-400 truncate">student@edumanage.com</p>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-3 text-slate-400 font-semibold">Or enter credentials</span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@edumanage.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/25 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-700/60 text-center text-xs text-slate-400">
            Powered by Next.js 14 App Router • Prisma ORM • PostgreSQL & SQLite
          </div>
        </div>
      </div>
    </div>
  );
}
