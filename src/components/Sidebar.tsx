'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  Bell,
  LogOut,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const adminLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Students', href: '/admin/students', icon: GraduationCap },
    { label: 'Teachers', href: '/admin/teachers', icon: Users },
    { label: 'Classes & Courses', href: '/admin/classes', icon: Layers },
    { label: 'Attendance Tracking', href: '/admin/attendance', icon: CalendarCheck },
    { label: 'Examinations', href: '/admin/exams', icon: Award },
    { label: 'Fee Management', href: '/admin/fees', icon: CreditCard },
    { label: 'Noticeboard', href: '/admin/notices', icon: Bell },
  ];

  const teacherLinks = [
    { label: 'My Dashboard', href: '/teacher', icon: LayoutDashboard },
    { label: 'Mark Attendance', href: '/teacher/attendance', icon: CalendarCheck },
    { label: 'Gradebook & Exams', href: '/teacher/grades', icon: Award },
    { label: 'Class Students', href: '/teacher/students', icon: GraduationCap },
    { label: 'Announcements', href: '/teacher/notices', icon: Bell },
  ];

  const studentLinks = [
    { label: 'Student Hub', href: '/student', icon: LayoutDashboard },
    { label: 'My Attendance', href: '/student/attendance', icon: CalendarCheck },
    { label: 'Report Cards & Exams', href: '/student/results', icon: Award },
    { label: 'Fee Payments', href: '/student/fees', icon: CreditCard },
    { label: 'Notices', href: '/student/notices', icon: Bell },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'TEACHER' ? teacherLinks : studentLinks;

  const roleBadgeColor = {
    ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
    TEACHER: 'bg-blue-100 text-blue-700 border-blue-200',
    STUDENT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }[role];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-1.5">
              EduManage
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                PRO
              </span>
            </h1>
            <p className="text-xs text-slate-500">Academic Cloud OS</p>
          </div>
        </Link>
      </div>

      {/* Role Pill */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Portal Role</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${roleBadgeColor}`}>
            {role}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm border border-brand-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info & Logout Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-800 truncate">{userName || 'Active User'}</p>
          <p className="text-[11px] text-slate-500 truncate">{userEmail || `${role.toLowerCase()}@edumanage.com`}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
