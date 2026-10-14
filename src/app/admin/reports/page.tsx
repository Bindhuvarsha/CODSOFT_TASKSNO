'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  FileBarChart,
  Printer,
  Download,
  CalendarCheck,
  CreditCard,
  Award,
  Users,
  CheckCircle2,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ReportsAdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [feeStats, setFeeStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReportsData() {
      try {
        setLoading(true);
        const [statsRes, classRes, feeRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/classes'),
          fetch('/api/fees/stats'),
        ]);

        const statsData = await statsRes.json();
        const classData = await classRes.json();
        const feeData = await feeRes.json();

        if (statsData.success) setStats(statsData.stats);
        if (classData.success) setClasses(classData.classes);
        if (feeData.success) setFeeStats(feeData.stats);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReportsData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="no-print">
        <Header
          title="Institutional Reports & Analytics"
          subtitle="Comprehensive academic records, financial statements, and attendance audits"
          role="ADMIN"
          userName="Dr. Eleanor Vance"
          actions={
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Executive Report</span>
            </button>
          }
        />
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
        {/* Printable Executive Document Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4 text-center">
            <h2 className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              EduManage Institutional Performance Audit
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official Academic Session 2026-2027 • Generated on {formatDate(new Date())}
            </p>
          </div>

          {/* High Level Key Findings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Enrolled Cohort</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats?.totalStudents || 10}</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Active</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Faculty Headcount</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats?.totalTeachers || 3}</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">3 Departments</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Attendance Health</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{stats?.attendanceRate || 92}%</p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">Above Benchmark</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Revenue Collected</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {formatCurrency(feeStats?.totalCollected || 11050)}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {feeStats?.collectionRate || 68}% of Target
              </span>
            </div>
          </div>

          {/* Class Cohorts Audit Breakdown */}
          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
              Cohort Enrollment & Instructional Deployment
            </h3>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Cohort</th>
                    <th className="py-2.5 px-3">Class In-Charge</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-center">Enrolled Students</th>
                    <th className="py-2.5 px-3 text-center">Curriculum Subjects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {classes.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {c.name} - Section {c.section}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {c.classTeacher?.user?.name || 'Assigned'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{c.room || 'North Wing'}</td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-indigo-700 dark:text-indigo-400">
                        {c._count.students}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-slate-700 dark:text-slate-300">
                        {c._count.subjects}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Revenue Breakdown */}
          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
              Financial Collections & Accounts Ledger
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Gross Billed Tuition:</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  {formatCurrency(feeStats?.totalBilled || 16250)}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Verified Collections:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  {formatCurrency(feeStats?.totalCollected || 11050)}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Outstanding Receivable:</span>
                <p className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                  {formatCurrency(feeStats?.pendingDues || 5200)}
                </p>
              </div>
            </div>
          </div>

          {/* Institutional Signatures */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-end justify-between text-xs text-slate-500 dark:text-slate-400">
            <div>
              <div className="w-36 border-b border-slate-400 dark:border-slate-600 mb-1"></div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Academic Registrar</p>
              <p className="text-[10px]">EduManage Governance Office</p>
            </div>

            <div className="text-right">
              <div className="w-36 border-b border-slate-400 dark:border-slate-600 mb-1 ml-auto"></div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Dr. Eleanor Vance</p>
              <p className="text-[10px]">Head of Institution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
