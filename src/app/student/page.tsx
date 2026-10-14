'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import FeePaymentModal from '@/components/FeePaymentModal';
import {
  CalendarCheck,
  Award,
  CreditCard,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  Sparkles,
  Download,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // Fetch Alex Rivera (first student or student profile)
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success && data.students.length > 0) {
        const demoStudent = data.students[0];
        // Fetch full profile with attendance and exams
        const detailRes = await fetch(`/api/students/${demoStudent.id}`);
        const detailData = await detailRes.json();
        if (detailData.success) {
          setStudent(detailData.student);
        }
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const attendances = student?.attendances || [];
  const presentCount = attendances.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendanceRate = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 94;

  const examResults = student?.examResults || [];
  const totalScore = examResults.reduce((sum: number, r: any) => sum + r.marksObtained, 0);
  const totalMax = examResults.reduce((sum: number, r: any) => sum + r.maxMarks, 0);
  const gpaPercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 92;

  const fees = student?.fees || [];
  const totalPendingFee = fees
    .filter((f: any) => f.status !== 'PAID')
    .reduce((sum: number, f: any) => sum + (f.amount - f.paidAmount), 0);

  const pendingInvoice = fees.find((f: any) => f.status !== 'PAID');

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Student Portal"
        subtitle="Academic performance, personal attendance, fee statements, and transcripts"
        role="STUDENT"
        userName="Alex Rivera"
        userAvatar={student?.user?.avatar}
        actions={
          <Link
            href="/student/results"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Download Report Card</span>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Profile Card Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-emerald-400/40 p-1 shrink-0 overflow-hidden">
                <img
                  src={student?.user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                  alt="Alex Rivera"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold">{student?.user?.name || 'Alex Rivera'}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Active Student
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Cohort: <strong>{student?.class?.name} - {student?.class?.section}</strong> • Roll #{student?.rollNo} • Adm: {student?.admissionNo}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Guardian: {student?.guardianName} ({student?.guardianRelation}) • {student?.guardianPhone}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 text-xs">
              <Link
                href="/student/attendance"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-center transition-colors shadow-xs"
              >
                Attendance Log
              </Link>
              <Link
                href="/student/fees"
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 text-center transition-colors"
              >
                Fee Statement
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            subtitle="Past 30 school days"
            icon={CalendarCheck}
            trend={{ value: 'Above 85% requirement', isPositive: true }}
            color="emerald"
          />

          <StatCard
            title="Academic Aggregate"
            value={`${gpaPercent}%`}
            subtitle="Midterm Cumulative"
            icon={Award}
            trend={{ value: 'Letter Grade A+', isPositive: true }}
            color="brand"
          />

          <StatCard
            title="Outstanding Balance"
            value={formatCurrency(totalPendingFee)}
            subtitle="Installment 2 pending"
            icon={CreditCard}
            trend={{ value: totalPendingFee > 0 ? 'Due May 15' : 'Settled', isPositive: totalPendingFee === 0 }}
            color="amber"
          />

          <StatCard
            title="Registered Subjects"
            value="4 Courses"
            subtitle="STEM & Humanities"
            icon={BookOpen}
            color="purple"
          />
        </div>

        {/* Academic Results and Fee Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Examination Scores */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Spring Midterm Examination Results</h3>
                <p className="text-xs text-slate-500">Official graded subject assessments</p>
              </div>
              <Link
                href="/student/results"
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <span>Full Official Transcript</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {examResults.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No examination scores published yet.</p>
              ) : (
                examResults.map((r: any) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{r.subject.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        Code: {r.subject.code} • {r.remarks || 'Commendable performance.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 text-sm">{r.marksObtained}</span>
                        <span className="text-[11px] text-slate-400 font-mono"> / {r.maxMarks}</span>
                      </div>
                      <span className="font-bold px-2.5 py-1 rounded bg-white border border-slate-200 text-xs text-slate-800 shadow-xs">
                        {r.grade}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Aggregate: <strong className="text-slate-900">{totalScore} / {totalMax} Marks</strong> ({gpaPercent}%)
              </span>
              <span className="font-bold text-emerald-700">Rank #1 in Section 10-A</span>
            </div>
          </div>

          {/* Fee Billing Reminder */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Fee Statement Status</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Account Active
                </span>
              </div>

              {pendingInvoice ? (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{pendingInvoice.title}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Invoice #{pendingInvoice.invoiceNumber}</p>
                    </div>
                    <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                      {pendingInvoice.status}
                    </span>
                  </div>

                  <div className="border-t border-amber-200/60 pt-2 flex justify-between text-xs">
                    <span className="text-slate-600">Total Billed:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(pendingInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Paid to date:</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(pendingInvoice.paidAmount)}</span>
                  </div>
                  <div className="border-t border-amber-200/60 pt-2 flex justify-between text-sm font-black text-rose-700">
                    <span>Due Balance:</span>
                    <span>{formatCurrency(pendingInvoice.amount - pendingInvoice.paidAmount)}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 italic mt-1">Due by {formatDate(pendingInvoice.dueDate)}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                  <p className="font-bold">All Academic Fees Cleared!</p>
                  <p className="text-[11px] text-emerald-600 mt-0.5">No outstanding balances for this quarter.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              {pendingInvoice ? (
                <button
                  onClick={() => {
                    setSelectedInvoice(pendingInvoice);
                    setIsPayModalOpen(true);
                  }}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  Pay Outstanding Balance Online
                </button>
              ) : (
                <Link
                  href="/student/fees"
                  className="w-full block py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold text-center transition-colors"
                >
                  View Payment Receipts
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <FeePaymentModal
        isOpen={isPayModalOpen}
        onClose={() => {
          setIsPayModalOpen(false);
          setSelectedInvoice(null);
        }}
        onSuccess={fetchStudentData}
        invoice={selectedInvoice}
      />
    </div>
  );
}
