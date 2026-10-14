'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import StudentModal from '@/components/StudentModal';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  UserPlus,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, classesRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/classes'),
      ]);

      const statsJson = await statsRes.json();
      const classesJson = await classesRes.json();

      if (statsJson.success) setStatsData(statsJson);
      if (classesJson.success) setClasses(classesJson.classes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = statsData?.stats || {
    totalStudents: 10,
    totalTeachers: 3,
    totalClasses: 4,
    attendanceRate: 92,
    collectionRate: 68,
    totalBilled: 16250,
    totalCollected: 11050,
    pendingDues: 5200,
  };

  const classDist = statsData?.classDistribution || [];
  const activities = statsData?.recentActivities || [];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Institutional Governance"
        subtitle="Real-time academic records, staffing, attendance, and financial analytics"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Enrolled Students"
            value={stats.totalStudents}
            subtitle="Across 4 active sections"
            icon={GraduationCap}
            trend={{ value: '+12% this term', isPositive: true }}
            color="brand"
          />

          <StatCard
            title="Faculty & Teachers"
            value={stats.totalTeachers}
            subtitle="Full-time academic staff"
            icon={Users}
            trend={{ value: '100% verified', isPositive: true }}
            color="blue"
          />

          <StatCard
            title="Average Attendance Rate"
            value={`${stats.attendanceRate}%`}
            subtitle="Past 14 school days"
            icon={CalendarCheck}
            trend={{ value: '+2.4% vs last week', isPositive: true }}
            color="emerald"
          />

          <StatCard
            title="Tuition & Fee Revenue"
            value={formatCurrency(stats.totalCollected)}
            subtitle={`${stats.collectionRate}% of billed collected`}
            icon={CreditCard}
            trend={{ value: `${formatCurrency(stats.pendingDues)} outstanding`, isPositive: false }}
            color="purple"
          />
        </div>

        {/* Analytics & Quick Launch Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Enrollment Distribution */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Enrollment by Class</h3>
                <p className="text-xs text-slate-500">Distribution of active students across sections</p>
              </div>
              <Link
                href="/admin/classes"
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
              >
                <span>Manage Classes</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3.5 mt-4">
              {classDist.map((c: any, idx: number) => {
                const max = Math.max(...classDist.map((item: any) => item.students), 10);
                const percent = Math.round((c.students / max) * 100);
                const colors = ['bg-brand-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
                const barColor = colors[idx % colors.length];

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 font-semibold">{c.name}</span>
                      <span className="text-slate-500">{c.students} Students</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${barColor} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick stats footer */}
            <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100 text-center">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Active Academic Year</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">2026-2027</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Billed Fees</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{formatCurrency(stats.totalBilled)}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Scheduled Exams</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">Midterms & Finals</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Administrative Shortcuts</h3>
              <p className="text-xs text-slate-500 mb-4">Direct workflows for daily management</p>

              <div className="space-y-2.5">
                <button
                  onClick={() => setIsStudentModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-200 text-slate-700 hover:text-brand-700 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <span>Enroll New Student</span>
                  </div>
                  <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                </button>

                <Link
                  href="/admin/teachers"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 text-slate-700 hover:text-blue-700 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>Manage Faculty Directory</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </Link>

                <Link
                  href="/admin/attendance"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <span>View Attendance Sheets</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </Link>

                <Link
                  href="/admin/fees"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 text-slate-700 hover:text-purple-700 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span>Fee Billing & Invoices</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </Link>

                <Link
                  href="/admin/notices"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 text-slate-700 hover:text-amber-700 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span>Publish Announcement</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </Link>
              </div>
            </div>

            <div className="mt-4 p-3 bg-brand-50/60 rounded-xl border border-brand-100 flex items-center gap-2.5 text-xs text-brand-800">
              <TrendingUp className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Full PostgreSQL schema & Prisma ORM active.</span>
            </div>
          </div>
        </div>

        {/* Activity Audit Log */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Institutional Activity Audit Trail</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Logged system events</span>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No activity logs recorded yet.</p>
            ) : (
              activities.map((act: any) => (
                <div key={act.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{act.details}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span>By {act.userName || 'System'}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600">{act.userRole}</span>
                        <span>•</span>
                        <span className="font-mono">{act.action}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(act.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSuccess={fetchDashboardData}
        classes={classes}
      />
    </div>
  );
}
