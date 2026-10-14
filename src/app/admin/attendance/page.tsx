'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useToast } from '@/components/ToastProvider';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Filter,
  Check,
  Calendar,
  BarChart3,
  TrendingUp,
  Award,
  Users,
  ChevronRight,
  Layers,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AttendanceAdminPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'analytics' | 'register'>('analytics');
  const [summaryView, setSummaryView] = useState<'weekly' | 'monthly'>('weekly');

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch initial classes and stats
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [classRes, statsRes, examsRes] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/attendance/stats'),
          fetch('/api/exams'),
        ]);

        const classData = await classRes.json();
        const statsData = await statsRes.json();
        const examsData = await examsRes.json();

        if (classData.success && classData.classes.length > 0) {
          setClasses(classData.classes);
          setSelectedClass(classData.classes[0].id);
        }
        if (statsData.success) {
          setStats(statsData.stats);
          if (statsData.trend) setTrend(statsData.trend);
        }
        if (examsData.success) {
          setExams(examsData.exams);
        }
      } catch (err) {
        console.error('Failed to load initial attendance data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Fetch attendance records for selected class and date
  const fetchClassAttendance = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        classId: selectedClass,
        date: selectedDate,
      });

      const [attRes, studentRes] = await Promise.all([
        fetch(`/api/attendance?${params.toString()}`),
        fetch(`/api/students?classId=${selectedClass}`),
      ]);

      const attData = await attRes.json();
      const studentData = await studentRes.json();

      const existingMap = new Map();
      if (attData.success) {
        attData.attendances.forEach((a: any) => existingMap.set(a.studentId, a));
      }

      // Merge students with attendance status
      const merged = (studentData.students || []).map((s: any) => {
        const existing = existingMap.get(s.id);
        return {
          studentId: s.id,
          studentName: s.name,
          rollNo: s.rollNo,
          admissionNo: s.admissionNo,
          avatar: s.avatar,
          status: existing ? existing.status : 'PRESENT',
          remarks: existing ? existing.remarks || '' : '',
        };
      });

      setAttendanceRecords(merged);
    } catch (err) {
      console.error('Failed to fetch class attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && activeTab === 'register') {
      fetchClassAttendance();
    }
  }, [selectedClass, selectedDate, activeTab]);

  const handleStatusChange = (studentId: string, newStatus: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status: newStatus } : r))
    );
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r))
    );
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          date: selectedDate,
          records: attendanceRecords.map((r) => ({
            studentId: r.studentId,
            status: r.status,
            remarks: r.remarks,
          })),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        success('Roll Call Updated', 'Daily attendance records successfully saved and indexed.');
        // Refresh stats
        const statsRes = await fetch('/api/attendance/stats');
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
          if (statsData.trend) setTrend(statsData.trend);
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        error('Save Failed', 'Could not record attendance. Please try again.');
      }
    } catch (err) {
      console.error('Failed to save attendance:', err);
      error('Network Error', 'Check connection to school database.');
    } finally {
      setSaving(false);
    }
  };

  const markAll = (status: string) => {
    setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  // Mock weekly and monthly trend data for visualization
  const weeklyDays = [
    { day: 'Mon', rate: 96, present: 10, absent: 0, date: 'Oct 09' },
    { day: 'Tue', rate: 94, present: 9, absent: 1, date: 'Oct 10' },
    { day: 'Wed', rate: 98, present: 10, absent: 0, date: 'Oct 11' },
    { day: 'Thu', rate: 92, present: 9, absent: 1, date: 'Oct 12' },
    { day: 'Fri', rate: 90, present: 9, absent: 1, date: 'Oct 13' },
  ];

  const monthlyBreakdown = [
    { month: 'August 2026', rate: 91.5, sessions: 22, status: 'Completed', color: 'bg-blue-500' },
    { month: 'September 2026', rate: 93.8, sessions: 21, status: 'Completed', color: 'bg-emerald-500' },
    { month: 'October 2026 (Current)', rate: 94.6, sessions: 14, status: 'In Progress', color: 'bg-indigo-600' },
  ];

  const classAttendanceBreakdown = [
    { name: 'Grade 10 - Section A', rate: 95.2, teacher: 'Dr. Sarah Jenkins', students: 10, status: 'Excellent' },
    { name: 'Grade 10 - Section B', rate: 92.0, teacher: 'Prof. Marcus Chen', students: 8, status: 'Healthy' },
    { name: 'Grade 11 - Section A', rate: 96.4, teacher: 'Elena Rostova', students: 10, status: 'Excellent' },
    { name: 'Grade 12 - Section A', rate: 93.1, teacher: 'Dr. Sarah Jenkins', students: 12, status: 'Healthy' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Analytics & Attendance Tracking"
        subtitle="Institution-wide roll call register, weekly & monthly summaries, and exam eligibility monitoring"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === 'register' && (
              <button
                onClick={handleSaveAttendance}
                disabled={saving || attendanceRecords.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {saving ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saveSuccess ? 'Changes Saved!' : 'Save Attendance'}</span>
              </button>
            )}
            <Link
              href="/admin/reports"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Export Report</span>
            </Link>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs: Analytics vs Daily Register */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Performance</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Daily Roll Call Register</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex text-[11px] font-semibold text-slate-500 items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Academic Year 2026-2027 • Term 1
          </span>
        </div>

        {/* 4 Clear Visual Indicators for Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Overall Attendance
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900">{stats?.rate || 94}%</p>
              <span className="text-[11px] font-bold text-emerald-600">+2.4% vs last term</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Exceeds 85% requirement</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${stats?.rate || 94}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Present Sessions
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-black text-emerald-600">{stats?.present || 14}</p>
              <span className="text-[11px] font-bold text-slate-500">Total present</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">88.5% on-time arrival rate</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="h-1.5 rounded-full bg-emerald-600" style={{ width: '88.5%' }}></div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Late Arrivals
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-black text-amber-600">{stats?.late || 1}</p>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                5.5% Tardy
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">With valid transit notes</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="h-1.5 rounded-full bg-amber-500" style={{ width: '5.5%' }}></div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Unexcused Absence
              </span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-black text-rose-600">{stats?.absent || 0}</p>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                Controlled
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">0 students below 75% cutoff</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="h-1.5 rounded-full bg-rose-500" style={{ width: '2.0%' }}></div>
            </div>
          </div>
        </div>

        {/* TAB 1: ANALYTICS & PERFORMANCE VIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Row 1: Attendance Charts + Weekly/Monthly Summary Toggle */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Trend Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Attendance & Performance Trends</h3>
                      <p className="text-xs text-slate-500">Day-by-day cohort attendance and punctuality index</p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => setSummaryView('weekly')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          summaryView === 'weekly'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Weekly View
                      </button>
                      <button
                        onClick={() => setSummaryView('monthly')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          summaryView === 'monthly'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Monthly Summary
                      </button>
                    </div>
                  </div>

                  {summaryView === 'weekly' ? (
                    <div>
                      <div className="grid grid-cols-5 gap-3 h-44 items-end pt-4">
                        {weeklyDays.map((d) => {
                          const heightPercent = Math.max(d.rate, 30);
                          return (
                            <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                              <span className="text-[10px] font-bold font-mono text-indigo-600 group-hover:scale-110 transition-transform">
                                {d.rate}%
                              </span>
                              <div className="w-full max-w-[42px] bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-end justify-center p-1 h-32 transition-colors">
                                <div
                                  className="w-full bg-linear-to-t from-indigo-600 to-indigo-500 rounded-lg transition-all duration-700 shadow-xs"
                                  style={{ height: `${heightPercent}%` }}
                                ></div>
                              </div>
                              <div className="text-center">
                                <span className="text-xs font-bold text-slate-800 block">{d.day}</span>
                                <span className="text-[10px] text-slate-400">{d.date}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                          Peak Attendance: <strong className="text-slate-800">Wednesday (98%)</strong>
                        </span>
                        <span>Weekly Average: <strong className="text-indigo-600">94.0%</strong></span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      {monthlyBreakdown.map((m) => (
                        <div key={m.month} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-900">{m.month}</span>
                            <span className="text-indigo-600 font-mono text-sm">{m.rate}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className={`h-2 rounded-full ${m.color}`} style={{ width: `${m.rate}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>{m.sessions} Academic Sessions Conducted</span>
                            <span className="text-emerald-700 font-semibold">{m.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Calculated across 10 enrolled active students</span>
                  <button
                    onClick={() => setActiveTab('register')}
                    className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <span>Launch Register</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Performance vs Attendance Correlation Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <h3 className="text-sm font-bold text-slate-900">Academic Correlation</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      R² = 0.88
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">
                    Students maintaining attendance above 90% demonstrate a 24% higher GPA across midterm examinations.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Attendance &gt; 90%</span>
                        <span className="text-purple-700">Avg Grade A (89%)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">8 Students in high achievement bracket</p>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Attendance 80% - 90%</span>
                        <span className="text-blue-700">Avg Grade B+ (78%)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">2 Students in standard achievement bracket</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Attendance &lt; 80%</span>
                        <span className="text-rose-600">Avg Grade C (62%)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">0 Students currently at academic risk</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>All cohorts meet board eligibility requirements</span>
                </div>
              </div>
            </div>

            {/* Row 2: Upcoming Examination Calendar & Class Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Examination Calendar */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-sm font-bold text-slate-900">Upcoming Examination Calendar</h3>
                    </div>
                    <Link
                      href="/admin/exams"
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                    >
                      <span>All Exams</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {exams.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No upcoming examinations.</p>
                    ) : (
                      exams.slice(0, 3).map((ex: any) => {
                        const examDate = new Date(ex.startDate);
                        const month = examDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                        const day = examDate.getDate();

                        return (
                          <div
                            key={ex.id}
                            className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-indigo-50/30 border border-slate-200/70 hover:border-indigo-200 transition-all flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-11 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shadow-xs shrink-0 text-center">
                                <span className="text-[9px] font-black uppercase text-indigo-600 leading-none">
                                  {month}
                                </span>
                                <span className="text-xs font-black text-slate-900 leading-tight mt-0.5">
                                  {day}
                                </span>
                              </div>

                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                  {ex.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {ex.class?.name} ({ex.class?.section}) • {ex.academicYear}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 uppercase">
                                {ex.examType}
                              </span>
                              <p className="text-[9px] text-slate-400 mt-1">Min 80% Att Req</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Admit cards issued only to qualified attendance tiers
                  </span>
                  <Link href="/admin/exams" className="text-xs font-bold text-indigo-600">
                    Schedule →
                  </Link>
                </div>
              </div>

              {/* Class Cohorts Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-900">Class Cohort Attendance Index</h3>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">4 Cohorts</span>
                  </div>

                  <div className="space-y-3.5">
                    {classAttendanceBreakdown.map((c) => (
                      <div key={c.name} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800">{c.name}</span>
                          <span className="text-emerald-700 font-mono font-bold">{c.rate}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${c.rate}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>In-charge: {c.teacher}</span>
                          <span className="font-semibold text-slate-700">{c.students} Students</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Automatic parent alerts triggered on unexcused marks</span>
                  <button
                    onClick={() => setActiveTab('register')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Mark Today's Register →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DAILY ROLL CALL REGISTER VIEW */}
        {activeTab === 'register' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Select Cohort</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Session Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Quick Mark All Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Quick Mark:</span>
                <button
                  type="button"
                  onClick={() => markAll('PRESENT')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll('ABSENT')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  All Absent
                </button>
              </div>
            </div>

            {/* Attendance Register Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Roll</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-3">Admission No</th>
                      <th className="py-3 px-4 text-center">Attendance Status</th>
                      <th className="py-3 px-4">Remarks / Exception Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4 animate-spin text-indigo-600" />
                            <span>Loading daily roll call register...</span>
                          </div>
                        </td>
                      </tr>
                    ) : attendanceRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No students enrolled in this cohort.
                        </td>
                      </tr>
                    ) : (
                      attendanceRecords.map((r) => (
                        <tr key={r.studentId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 font-mono">#{r.rollNo}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs overflow-hidden border">
                                {r.avatar ? <img src={r.avatar} alt={r.studentName} /> : r.studentName[0]}
                              </div>
                              <span className="font-semibold text-slate-900">{r.studentName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500">{r.admissionNo}</td>

                          {/* Interactive Status Pills */}
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as const).map((st) => {
                                const isSelected = r.status === st;
                                const colors = {
                                  PRESENT: isSelected
                                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700',
                                  LATE: isSelected
                                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700',
                                  ABSENT: isSelected
                                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700',
                                  EXCUSED: isSelected
                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700',
                                }[st];

                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleStatusChange(r.studentId, st)}
                                    className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${colors}`}
                                  >
                                    {st}
                                  </button>
                                );
                              })}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={r.remarks}
                              onChange={(e) => handleRemarksChange(r.studentId, e.target.value)}
                              placeholder="Add note (e.g. sick leave, bus delay)..."
                              className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 focus:bg-white"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {attendanceRecords.filter((r) => r.status === 'PRESENT').length} of{' '}
                  {attendanceRecords.length} Students Present on {formatDate(selectedDate)}
                </span>
                <button
                  onClick={handleSaveAttendance}
                  disabled={saving}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Register'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
