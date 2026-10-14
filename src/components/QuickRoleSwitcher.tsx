'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, GraduationCap, School, Check, Loader2 } from 'lucide-react';

interface QuickRoleSwitcherProps {
  currentRole?: string;
  variant?: 'banner' | 'compact';
}

export default function QuickRoleSwitcher({ currentRole, variant = 'banner' }: QuickRoleSwitcherProps) {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleQuickLogin = async (role: 'ADMIN' | 'TEACHER' | 'STUDENT', email: string) => {
    try {
      setLoadingRole(role);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(data.redirect);
        router.refresh();
      }
    } catch (err) {
      console.error('Quick login failed:', err);
    } finally {
      setLoadingRole(null);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
        <button
          onClick={() => handleQuickLogin('ADMIN', 'admin@edumanage.com')}
          disabled={loadingRole !== null}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
            currentRole === 'ADMIN'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
          title="Switch to Administrator Demo"
        >
          {loadingRole === 'ADMIN' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
          Admin
        </button>

        <button
          onClick={() => handleQuickLogin('TEACHER', 'sarah.jenkins@edumanage.com')}
          disabled={loadingRole !== null}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
            currentRole === 'TEACHER'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
          title="Switch to Teacher Demo"
        >
          {loadingRole === 'TEACHER' ? <Loader2 className="w-3 h-3 animate-spin" /> : <School className="w-3 h-3" />}
          Teacher
        </button>

        <button
          onClick={() => handleQuickLogin('STUDENT', 'student@edumanage.com')}
          disabled={loadingRole !== null}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
            currentRole === 'STUDENT'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
          title="Switch to Student Demo"
        >
          {loadingRole === 'STUDENT' ? <Loader2 className="w-3 h-3 animate-spin" /> : <GraduationCap className="w-3 h-3" />}
          Student
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2.5 border-b border-indigo-800/40 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-slate-200">EduManage Demo Switcher:</span>
        <span className="text-slate-400 hidden sm:inline">Test different role views instantly:</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuickLogin('ADMIN', 'admin@edumanage.com')}
          disabled={loadingRole !== null}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentRole === 'ADMIN'
              ? 'bg-purple-600 text-white font-semibold ring-2 ring-purple-400/50'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {loadingRole === 'ADMIN' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : currentRole === 'ADMIN' ? (
            <Check className="w-3 h-3 text-purple-200" />
          ) : (
            <ShieldCheck className="w-3 h-3 text-purple-400" />
          )}
          <span>Admin Portal</span>
        </button>

        <button
          onClick={() => handleQuickLogin('TEACHER', 'sarah.jenkins@edumanage.com')}
          disabled={loadingRole !== null}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentRole === 'TEACHER'
              ? 'bg-blue-600 text-white font-semibold ring-2 ring-blue-400/50'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {loadingRole === 'TEACHER' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : currentRole === 'TEACHER' ? (
            <Check className="w-3 h-3 text-blue-200" />
          ) : (
            <School className="w-3 h-3 text-blue-400" />
          )}
          <span>Teacher Portal</span>
        </button>

        <button
          onClick={() => handleQuickLogin('STUDENT', 'student@edumanage.com')}
          disabled={loadingRole !== null}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
            currentRole === 'STUDENT'
              ? 'bg-emerald-600 text-white font-semibold ring-2 ring-emerald-400/50'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {loadingRole === 'STUDENT' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : currentRole === 'STUDENT' ? (
            <Check className="w-3 h-3 text-emerald-200" />
          ) : (
            <GraduationCap className="w-3 h-3 text-emerald-400" />
          )}
          <span>Student Portal</span>
        </button>
      </div>
    </div>
  );
}
