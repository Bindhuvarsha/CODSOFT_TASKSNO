'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { CalendarCheck, CheckCircle2, Clock, Save, Check } from 'lucide-react';

export default function TeacherAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [classInfo, setClassInfo] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Find Grade 10-A class
        const classRes = await fetch('/api/classes');
        const classJson = await classRes.json();
        const grade10A = classJson.classes?.[0];
        setClassInfo(grade10A);

        if (grade10A) {
          const [studRes, attRes] = await Promise.all([
            fetch(`/api/students?classId=${grade10A.id}`),
            fetch(`/api/attendance?classId=${grade10A.id}&date=${selectedDate}`),
          ]);

          const studJson = await studRes.json();
          const attJson = await attRes.json();

          const existingAttMap = new Map();
          if (attJson.success) {
            attJson.attendances.forEach((a: any) => existingAttMap.set(a.studentId, a));
          }

          const merged = (studJson.students || []).map((s: any) => {
            const ex = existingAttMap.get(s.id);
            return {
              studentId: s.id,
              studentName: s.name,
              rollNo: s.rollNo,
              admissionNo: s.admissionNo,
              avatar: s.avatar,
              status: ex ? ex.status : 'PRESENT',
              remarks: ex ? ex.remarks || '' : '',
            };
          });

          setStudents(studJson.students || []);
          setRecords(merged);
        }
      } catch (err) {
        console.error('Error loading attendance:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedDate]);

  const handleStatusChange = (studentId: string, status: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r))
    );
  };

  const markAll = (status: string) => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSave = async () => {
    if (!classInfo) return;
    try {
      setSaving(true);
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: classInfo.id,
          date: selectedDate,
          records: records.map((r) => ({
            studentId: r.studentId,
            status: r.status,
            remarks: r.remarks,
          })),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit attendance:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Class Roll Call & Attendance"
        subtitle={`Class: ${classInfo?.name || 'Grade 10'} - Section ${classInfo?.section || 'A'} • Hall ${classInfo?.room || '101'}`}
        role="TEACHER"
        userName="Prof. Sarah Jenkins"
        actions={
          <button
            onClick={handleSave}
            disabled={saving || records.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'Submitted Successfully!' : 'Save Attendance Roll'}</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Date and Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Attendance Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
            <div className="pt-4">
              <span className="text-xs text-slate-500 font-medium">
                Cohort: <strong>{classInfo?.name} - {classInfo?.section}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Batch Action:</span>
            <button
              onClick={() => markAll('PRESENT')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => markAll('ABSENT')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Attendance Register */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student Profile</th>
                  <th className="py-3 px-3">Admission ID</th>
                  <th className="py-3 px-4 text-center">Mark Attendance</th>
                  <th className="py-3 px-4">Faculty Comment / Excuse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      Loading roll call roster...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      No students found for this class.
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.studentId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono">#{r.rollNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs overflow-hidden">
                            {r.avatar ? <img src={r.avatar} alt={r.studentName} /> : r.studentName[0]}
                          </div>
                          <span className="font-semibold text-slate-900">{r.studentName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{r.admissionNo}</td>

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
                          placeholder="Optional remark..."
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 focus:bg-white"
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
              {records.filter((r) => r.status === 'PRESENT').length} Present •{' '}
              {records.filter((r) => r.status === 'ABSENT').length} Absent •{' '}
              {records.filter((r) => r.status === 'LATE').length} Late
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              {saving ? 'Submitting...' : 'Save & Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
