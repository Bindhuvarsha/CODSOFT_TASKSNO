'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { formatDate, getAttendanceBadge } from '@/lib/utils';

export default function StudentAttendancePage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/students');
        const data = await res.json();
        if (data.success && data.students.length > 0) {
          const detailRes = await fetch(`/api/students/${data.students[0].id}`);
          const detailData = await detailRes.json();
          if (detailData.success) {
            setStudent(detailData.student);
          }
        }
      } catch (err) {
        console.error('Failed to load attendance:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const attendances = student?.attendances || [];
  const presentCount = attendances.filter((a: any) => a.status === 'PRESENT').length;
  const lateCount = attendances.filter((a: any) => a.status === 'LATE').length;
  const excusedCount = attendances.filter((a: any) => a.status === 'EXCUSED').length;
  const absentCount = attendances.filter((a: any) => a.status === 'ABSENT').length;
  const total = attendances.length;
  const percentage = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 94;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Personal Attendance Records"
        subtitle="Daily class roll call history, punctuality metrics, and absence logs"
        role="STUDENT"
        userName="Alex Rivera"
      />

      <div className="p-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Attendance Standing</span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{percentage}%</p>
            <span className="text-[10px] text-emerald-700 font-medium">Eligible for examinations</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Present Days</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{presentCount}</p>
            <span className="text-[10px] text-slate-400">Total sessions</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Late Arrivals</span>
            <p className="text-3xl font-black text-amber-600 mt-1">{lateCount}</p>
            <span className="text-[10px] text-slate-400">Recorded with remark</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Excused / Absent</span>
            <p className="text-3xl font-black text-slate-700 mt-1">{excusedCount + absentCount}</p>
            <span className="text-[10px] text-slate-400">{excusedCount} medical leaves</span>
          </div>
        </div>

        {/* Daily Attendance History */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Attendance Log (Past 30 School Days)</h3>
              <p className="text-xs text-slate-500">Recorded by Prof. Sarah Jenkins (Class In-Charge)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Grade 10 - Section A
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-3">Session Day</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Teacher Remark / Exemption Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-400">
                      Loading attendance records...
                    </td>
                  </tr>
                ) : attendances.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500">
                      No attendance entries logged yet.
                    </td>
                  </tr>
                ) : (
                  attendances.map((att: any) => {
                    const badge = getAttendanceBadge(att.status);
                    const d = new Date(att.date);
                    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });

                    return (
                      <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                          {formatDate(att.date)}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{dayName}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 italic">
                          {att.remarks || 'Regular attendance logged on schedule.'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
