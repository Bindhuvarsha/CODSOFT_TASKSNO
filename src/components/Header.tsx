'use client';

import React from 'react';
import QuickRoleSwitcher from './QuickRoleSwitcher';
import { Calendar, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  userName?: string;
  userAvatar?: string | null;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, role, userName, userAvatar, actions }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-10 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
            2026-2027 Session
          </span>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {actions}

        {/* Quick demo role selector right on header */}
        <div className="hidden lg:flex items-center">
          <QuickRoleSwitcher currentRole={role} variant="compact" />
        </div>

        {/* Date Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs">
            {userAvatar ? (
              <img src={userAvatar} alt={userName || 'Avatar'} className="w-full h-full object-cover" />
            ) : (
              (userName || 'U')[0]
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{userName || 'EduManage User'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
