'use client';

import React, { useState } from 'react';
import QuickRoleSwitcher from './QuickRoleSwitcher';
import { useMobileNav } from './MobileNavContext';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  subtitle?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  userName?: string;
  userAvatar?: string | null;
  actions?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  role,
  userName,
  userAvatar,
  actions,
}: HeaderProps) {
  const { toggle: toggleMobileNav } = useMobileNav();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const sampleNotifications = [
    { id: 1, title: 'Spring Midterm Exam Timetable', time: '10m ago', unread: true },
    { id: 2, title: 'Term 2 Fee Installment Due', time: '2h ago', unread: true },
    { id: 3, title: 'Faculty Assembly on Saturday', time: '1d ago', unread: false },
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sticky top-0 z-30 shadow-xs">
      {/* Left Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{title}</h1>
            <span className="hidden sm:inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-semibold uppercase tracking-wider">
              2026-2027
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>}
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, classes, records..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Actions, Notifications, Profile, Role Switcher */}
      <div className="flex items-center gap-2.5 justify-between sm:justify-end">
        {actions}

        {/* Quick Demo Switcher Compact */}
        <div className="hidden xl:flex items-center">
          <QuickRoleSwitcher currentRole={role} variant="compact" />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  2 Unread
                </span>
              </div>
              <div className="space-y-1.5">
                {sampleNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      n.unread ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-semibold text-slate-800">{n.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                <Link
                  href={role === 'ADMIN' ? '/admin/notices' : role === 'TEACHER' ? '/teacher/notices' : '/student/notices'}
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 block"
                >
                  View All Announcements →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200 shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                (userName || 'U')[0]
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{userName || 'EduManage User'}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="font-bold text-slate-900">{userName}</p>
                <p className="text-[10px] text-slate-500 capitalize">{role.toLowerCase()} portal</p>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Profile</span>
              </Link>

              <Link
                href="/login"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
