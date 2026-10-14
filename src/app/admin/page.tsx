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
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { success } = useToast();
  const [statsData, setStatsData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [pendingFeeStudents, setPendingFeeStudents] = useState<any[]>([]);
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

      if (statsJson.success) setStatsData(statsJson);
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
        title="Institutional Dashboard"
        subtitle="Real-time academic performance, enrollment, staff, and financial intelligence"
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
        {/* Quick Action Shortcuts Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-800">Quick Actions:</span>
            <span className="text-xs text-slate-500 hidden md:inline">Launch frequent institutional workflows</span>
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
          </div>
        </div>

        {/* 4 Required Visually Distinct Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            subtitle="Active enrollments"
            icon={GraduationCap}
            trend={{ value: '+12% this month', isPositive: true }}
            color="brand"
          />

          <StatCard
            title="Active Courses"
            value={`${stats.totalSubjects || 7} Subjects`}
            subtitle="Across 4 cohorts"
            icon={BookOpen}
            trend={{ value: 'Full faculty allocated', isPositive: true }}
            color="emerald"
          />

          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            subtitle="Daily roll call average"
            icon={CalendarCheck}
            trend={{ value: '+2.4% vs last month', isPositive: true }}
            color="blue"
          />

          <StatCard
            title="Pending Fees"
            value={formatCurrency(stats.pendingDues)}
            subtitle={`${stats.collectionRate}% collected`}
            icon={CreditCard}
            trend={{ value: `${pendingFeeStudents.length} pending accounts`, isPositive: false }}
            color="amber"
          />
        </div>

        {/* Middle Row: Student Enrollment Chart + Attendance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Enrollment Distribution */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Enrollment by Class Cohort</h3>
                <p className="text-xs text-slate-500">Distribution across active grade sections</p>
              </div>
              <Link
                href="/admin/classes"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <span>View All Classes</span>
                <ArrowUpRight className="w-3 h-3" />
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
                      <span className="text-slate-500 font-mono">{c.students} Students ({percent}%)</span>
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
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Capacity</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">120 Seats</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Occupancy Rate</p>
                <p className="text-base font-bold text-emerald-600 mt-0.5">83.3%</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Graduation Track</p>
                <p className="text-base font-bold text-indigo-600 mt-0.5">Grade 12 Tech</p>
              </div>
            </div>
          </div>

          {/* Attendance Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Attendance Overview</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Healthy
                </span>
              </div>

              {/* Attendance Ring / Percentage Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Institutional Average
                </span>
                <p className="text-4xl font-black text-indigo-600">{stats.attendanceRate}%</p>
                <p className="text-xs text-slate-500">Above mandatory 85% requirement</p>
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

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    Unexcused Absence
                  </span>
                  <span className="font-bold text-slate-900">6.0%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/admin/attendance"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <span>Open Daily Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: Upcoming Examinations + Students with Pending Fees + Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Examinations */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Examinations</h3>
              </div>
              <Link href="/admin/exams" className="text-xs text-indigo-600 hover:underline font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {exams.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No upcoming examinations.</p>
              ) : (
                exams.slice(0, 3).map((ex: any) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{ex.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {ex.class?.name} - {ex.class?.section}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200 shrink-0">
                      {formatDate(ex.startDate)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Students with Pending Fees */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Pending Fee Accounts</h3>
              </div>
              <Link href="/admin/fees" className="text-xs text-indigo-600 hover:underline font-semibold">
                Billing Desk
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

          {/* Recent Activity Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Activities</h3>
              </div>
              <span className="text-[10px] text-slate-400">Live Audit</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {activities.slice(0, 4).map((act: any) => (
                <div key={act.id} className="py-2.5 flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>
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
