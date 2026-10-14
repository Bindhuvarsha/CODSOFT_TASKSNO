'use client';

import React, { useState } from 'react';
import { useMobileNav } from './MobileNavContext';
import { useTheme } from './ThemeProvider';
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
  Sun,
  Moon,
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
  const { theme, toggleTheme } = useTheme();
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
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      {/* Left Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
            <span className="hidden sm:inline-block text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider">
              2026-2027
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>}
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, classes, records..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Actions, Theme Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2.5 justify-between sm:justify-end">
        {actions}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-750 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-750 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                  2 Unread
                </span>
              </div>
              <div className="space-y-1.5">
                {sampleNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      n.unread
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/70'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  href={role === 'ADMIN' ? '/admin/notices' : role === 'TEACHER' ? '/teacher/notices' : '/student/notices'}
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline block"
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
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800 shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                (userName || 'U')[0]
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{userName || 'EduManage User'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="font-bold text-slate-900 dark:text-white">{userName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{role.toLowerCase()} portal</p>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Profile</span>
              </Link>

              <Link
                href="/login"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
