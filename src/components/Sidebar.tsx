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
  FileBarChart,
  Settings,
  Bell,
  LogOut,
  Layers,
  X,
} from 'lucide-react';

interface SidebarProps {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  userName?: string;
  userEmail?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  role,
  userName,
  userEmail,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
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
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Students', href: '/admin/students', icon: GraduationCap },
    { label: 'Teachers', href: '/admin/teachers', icon: Users },
    { label: 'Courses & Classes', href: '/admin/classes', icon: BookOpen },
    { label: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
    { label: 'Examinations', href: '/admin/exams', icon: Award },
    { label: 'Fees & Billing', href: '/admin/fees', icon: CreditCard },
    { label: 'Reports', href: '/admin/reports', icon: FileBarChart },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const teacherLinks = [
    { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { label: 'Mark Attendance', href: '/teacher/attendance', icon: CalendarCheck },
    { label: 'Gradebook & Exams', href: '/teacher/grades', icon: Award },
    { label: 'Class Students', href: '/teacher/students', icon: GraduationCap },
    { label: 'Noticeboard', href: '/teacher/notices', icon: Bell },
  ];

  const studentLinks = [
    { label: 'Student Hub', href: '/student', icon: LayoutDashboard },
    { label: 'My Attendance', href: '/student/attendance', icon: CalendarCheck },
    { label: 'Report Cards & Exams', href: '/student/results', icon: Award },
    { label: 'Fee Payments', href: '/student/fees', icon: CreditCard },
    { label: 'School Notices', href: '/student/notices', icon: Bell },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'TEACHER' ? teacherLinks : studentLinks;

  const roleBadgeColor = {
    ADMIN: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    TEACHER: 'bg-blue-100 text-blue-700 border-blue-200',
    STUDENT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }[role];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-10 w-64 bg-white border-r border-slate-200 flex flex-col h-screen transition-transform duration-200 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-1.5">
                EduManage
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  PRO
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">Student Management System</p>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Pill */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Active Role</span>
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
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
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
            <p className="text-xs font-bold text-slate-800 truncate">{userName || 'Active User'}</p>
            <p className="text-[11px] text-slate-500 truncate">{userEmail || `${role.toLowerCase()}@edumanage.com`}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
