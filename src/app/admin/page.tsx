'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import StudentModal from '@/components/StudentModal';
import { useToast } from '@/components/ToastProvider';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  UserPlus,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileText,
  Calendar,
  AlertCircle,
  FileBarChart,
  ArrowRight,
  Award,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Layers,
  Search,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { success } = useToast();
  const [statsData, setStatsData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [pendingFeeStudents, setPendingFeeStudents] = useState<any[]>([]);
  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, classesRes, examsRes, feesRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/classes'),
        fetch('/api/exams'),
        fetch('/api/fees?status=PENDING'),
      ]);

      const statsJson = await statsRes.json();
      const classesJson = await classesRes.json();
      const examsJson = await examsRes.json();
      const feesJson = await feesRes.json();

      if (statsJson.success) {
        setStatsData(statsJson);
        if (statsJson.recentAdmissions) {
          setRecentAdmissions(statsJson.recentAdmissions);
        }
        if (statsJson.upcomingEvents) {
          setUpcomingEvents(statsJson.upcomingEvents);
        }
      }
      if (classesJson.success) setClasses(classesJson.classes);
      if (examsJson.success) setExams(examsJson.exams);
      if (feesJson.success) setPendingFeeStudents(feesJson.invoices.slice(0, 4));
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
    totalSubjects: 7,
    attendanceRate: 94,
    collectionRate: 68,
    totalBilled: 16250,
    totalCollected: 11050,
    pendingDues: 5200,
  };

  const classDist = statsData?.classDistribution || [];
  const activities = statsData?.recentActivities || [];

  // Default fallback upcoming events if none returned
  const displayEvents =
    upcomingEvents && upcomingEvents.length > 0
      ? upcomingEvents
      : [
          {
            id: 'evt-1',
            title: 'Midterm Examination 2026',
            subtitle: 'Grade 10 & 11 - Main Hall',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'EXAM',
            type: 'MIDTERM',
          },
          {
            id: 'evt-2',
            title: 'Parent-Teacher Council Meet',
            subtitle: 'All Cohorts - Auditorium',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'ACADEMIC',
            type: 'MEETING',
          },
          {
            id: 'evt-3',
            title: 'Term 2 Fee Reconciliation',
            subtitle: 'Accounts & Billing Office',
            date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'FINANCE',
            type: 'DEADLINE',
          },
        ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Institutional Dashboard"
        subtitle="Real-time academic performance, enrollment, faculty, and financial intelligence"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/attendance"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Mark Attendance</span>
            </Link>
            <button
              onClick={() => setIsStudentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Modern Welcome Header Banner with Profile & Quick Badges */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 sm:p-7 shadow-xl shadow-indigo-950/20 border border-indigo-900/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr from-indigo-500 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/30">
                  <div className="w-full h-full rounded-[14px] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl tracking-wider">
                    EV
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 backdrop-blur-xs">
                    Institutional Administrator
                  </span>
                  <span className="text-[11px] font-medium text-slate-300">
                    Academic Year 2026-2027
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
                  Welcome back, Dr. Eleanor Vance! <span className="inline-block animate-bounce">👋</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Centralized institutional dashboard is fully synchronized. All 4 cohort sections are active, teacher roll calls are up to date, and fee reconciliations are live.
                </p>
              </div>
            </div>

            {/* Quick Badges inside Welcome Header */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 bg-white/5 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/10 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">System Status</p>
                <p className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 100% Operational
                </p>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Current Term</p>
                <p className="text-xs font-black text-white mt-0.5">Term 1 • Week 8</p>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Institution</p>
                <p className="text-xs font-black text-indigo-300 mt-0.5">EduManage HQ</p>
              </div>
            </div>
          </div>

          {/* Background Ambient Glows */}
          <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/2 -top-16 w-56 h-56 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Quick Institutional Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-800">Quick Actions:</span>
            <span className="text-xs text-slate-500 hidden md:inline">Launch frequent administrative workflows</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsStudentModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>

            <Link
              href="/admin/attendance"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Mark Attendance</span>
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors"
            >
              <FileBarChart className="w-3.5 h-3.5" />
              <span>Create Report</span>
            </Link>

            <Link
              href="/admin/fees"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Fee Invoices</span>
            </Link>
          </div>
        </div>

        {/* 4 Required Visually Distinct Summary Cards */}
        {/* Total students, teachers, courses and attendance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            subtitle="Enrolled active learners"
            icon={GraduationCap}
            trend={{ value: '+12% this month', isPositive: true }}
            color="brand"
          />

          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            subtitle="Full-time academic faculty"
            icon={Users}
            trend={{ value: 'Full faculty allocated', isPositive: true }}
            color="blue"
          />

          <StatCard
            title="Total Courses"
            value={`${stats.totalSubjects || 7} Courses`}
            subtitle="Across 4 active cohorts"
            icon={BookOpen}
            trend={{ value: 'Curriculum 100% on track', isPositive: true }}
            color="emerald"
          />

          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            subtitle="Daily roll call average"
            icon={CalendarCheck}
            trend={{ value: '+2.4% vs last month', isPositive: true }}
            color="amber"
          />
        </div>

        {/* Section: Recent Admissions & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Widget 1: Recent Admissions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Recent Admissions</h3>
                    <p className="text-xs text-slate-500">Newly enrolled student profiles</p>
                  </div>
                </div>
                <Link
                  href="/admin/students"
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 group"
                >
                  <span>View All Students</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentAdmissions.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p>No recent admissions recorded.</p>
                  </div>
                ) : (
                  recentAdmissions.map((student: any) => {
                    const initials = student.user?.name
                      ? student.user.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'ST';

                    return (
                      <div
                        key={student.id}
                        className="p-3 rounded-xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200/70 hover:border-indigo-200 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {student.user?.avatar ? (
                            <img
                              src={student.user.avatar}
                              alt={student.user.name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {student.user?.name}
                              </p>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-semibold shrink-0">
                                {student.admissionNo}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {student.class ? `${student.class.name} (${student.class.section})` : 'Unassigned'} • Roll #{student.rollNo}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="hidden sm:inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                            title="View Student Dossier"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Automated admission ID sequencing enabled</span>
              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>+ Enroll New</span>
              </button>
            </div>
          </div>

          {/* Widget 2: Upcoming Events */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Upcoming Events & Examinations</h3>
                    <p className="text-xs text-slate-500">Academic timetable & key deadlines</p>
                  </div>
                </div>
                <Link
                  href="/admin/exams"
                  className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 group"
                >
                  <span>Exams Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {displayEvents.map((evt: any) => {
                  const eventDate = new Date(evt.date);
                  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  const day = eventDate.getDate();

                  const isExam = evt.category === 'EXAM';
                  const isFinance = evt.category === 'FINANCE';

                  const badgeColor = isExam
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : isFinance
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-blue-100 text-blue-700 border-blue-200';

                  return (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-slate-50/70 hover:bg-purple-50/30 border border-slate-200/70 hover:border-purple-200 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Calendar Day Pill */}
                        <div className="w-10 h-11 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shadow-xs shrink-0 text-center">
                          <span className="text-[9px] font-black uppercase text-indigo-600 leading-none">
                            {month}
                          </span>
                          <span className="text-xs font-black text-slate-900 leading-tight mt-0.5">
                            {day}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-purple-700 transition-colors">
                              {evt.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {evt.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}
                        >
                          {evt.category || 'EVENT'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Synched with Institutional Academic Calendar</span>
              <Link href="/admin/exams" className="text-xs font-bold text-purple-600 hover:text-purple-700">
                Full Schedule →
              </Link>
            </div>
          </div>
        </div>

        {/* Section: Analytics and Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrollment Distribution & Cohort Capacity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Enrollment by Class Cohort</h3>
                <p className="text-xs text-slate-500">Distribution across active grade sections and student limits</p>
              </div>
              <Link
                href="/admin/classes"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <span>Manage Cohorts</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4 mt-6">
              {classDist.map((c: any, idx: number) => {
                const max = Math.max(...classDist.map((item: any) => item.students), 10);
                const percent = Math.round((c.students / max) * 100);
                const colors = ['bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600'];
                const barColor = colors[idx % colors.length];

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{c.name}</span>
                      <span className="text-slate-500 font-mono">
                        {c.students} Students ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full ${barColor} transition-all duration-700`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Institutional Capacity</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">120 Seats</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Seat Occupancy</p>
                <p className="text-base font-bold text-emerald-600 mt-0.5">83.3%</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Graduation Track</p>
                <p className="text-base font-bold text-indigo-600 mt-0.5">Grade 12 Science</p>
              </div>
            </div>
          </div>

          {/* Attendance Analytics Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Attendance Analytics</h3>
                  <p className="text-xs text-slate-500">Live institutional roll call register</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Healthy
                </span>
              </div>

              {/* Attendance Ring / Percentage Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Roll Call Average
                </span>
                <p className="text-4xl font-black text-indigo-600">{stats.attendanceRate}%</p>
                <p className="text-xs text-slate-500">Exceeds 85% institutional minimum</p>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Present Sessions
                  </span>
                  <span className="font-bold text-slate-900">88.5%</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Late Arrivals
                  </span>
                  <span className="font-bold text-slate-900">5.5%</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    Excused Leaves
                  </span>
                  <span className="font-bold text-slate-900">4.0%</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    Unexcused Absence
                  </span>
                  <span className="font-bold text-slate-900">2.0%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                href="/admin/attendance"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Open Daily Register</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section: Pending Fees & Live Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Fees Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Pending Fee Accounts</h3>
                </div>
                <Link href="/admin/fees" className="text-xs text-indigo-600 hover:underline font-semibold">
                  Billing Desk →
                </Link>
              </div>

              <div className="space-y-3">
                {pendingFeeStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">All tuition invoices cleared!</p>
                ) : (
                  pendingFeeStudents.map((inv: any) => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{inv.student.user.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {inv.title} • {inv.invoiceNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-amber-800">
                          {formatCurrency(inv.amount - inv.paidAmount)}
                        </p>
                        <span className="text-[9px] font-bold text-rose-600 uppercase">Pending</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Total Pending Dues: {formatCurrency(stats.pendingDues)}</span>
              <span className="font-bold text-emerald-600">{stats.collectionRate}% Collected</span>
            </div>
          </div>

          {/* Recent Activity Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Institutional Activity Trail</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Live Audit
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {activities.slice(0, 4).map((act: any) => (
                  <div key={act.id} className="py-2.5 flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 line-clamp-1">{act.details}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {act.userName} • {formatDate(act.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>All changes cryptographically logged</span>
              <Link href="/admin/settings" className="text-xs font-bold text-slate-700 hover:text-indigo-600">
                Audit Logs →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSuccess={() => {
          success('Student Enrolled Successfully', 'The new student profile is now active.');
          fetchDashboardData();
        }}
        classes={classes}
      />
    </div>
  );
}
