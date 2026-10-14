'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
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
} from 'lucide-react';
import { getAttendanceBadge, formatDate } from '@/lib/utils';

export default function AttendanceAdminPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch classes
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch('/api/classes');
        const data = await res.json();
        if (data.success && data.classes.length > 0) {
          setClasses(data.classes);
          setSelectedClass(data.classes[0].id);
        }
      } catch (err) {
        console.error('Failed to load classes:', err);
      }
    }
    loadClasses();
  }, []);

  // Fetch overall attendance stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/attendance/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load attendance stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
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
    if (selectedClass) {
      fetchClassAttendance();
    }
  }, [selectedClass, selectedDate]);

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
        fetchStats();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save attendance:', err);
    } finally {
      setSaving(false);
    }
  };

  const markAll = (status: string) => {
    setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Institutional Attendance Intelligence"
        subtitle="Daily register tracking, automatic percentage analytics, and exception management"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <button
            onClick={handleSaveAttendance}
            disabled={saving || attendanceRecords.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'Changes Saved!' : 'Save Attendance'}</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Overall Attendance</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.rate || 92}%</p>
            <span className="text-[10px] text-emerald-600 font-medium">Institution-wide standard</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Present Records</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats?.present || 0}</p>
            <span className="text-[10px] text-slate-400">Total sessions</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Late Arrivals</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats?.late || 0}</p>
            <span className="text-[10px] text-slate-400">Recorded with remark</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Unexcused Absences</span>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats?.absent || 0}</p>
            <span className="text-[10px] text-slate-400">Requires follow-up</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Select Cohort</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
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
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
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
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
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
                      Loading register...
                    </td>
                  </tr>
                ) : attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No students enrolled in this class.
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

                      {/* Interactive Radio Pills for Status */}
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
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50/50 focus:bg-white"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {attendanceRecords.filter((r) => r.status === 'PRESENT').length} of{' '}
              {attendanceRecords.length} Students Present on {selectedDate}
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
    </div>
  );
}
