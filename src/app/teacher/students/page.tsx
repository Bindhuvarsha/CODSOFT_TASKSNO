'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  Users,
  Search,
  Phone,
  Mail,
  CalendarCheck,
  Heart,
  User,
  GraduationCap,
} from 'lucide-react';

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        // Get class 10-A
        const classRes = await fetch('/api/classes');
        const classJson = await classRes.json();
        const grade10A = classJson.classes?.[0];

        if (grade10A) {
          const res = await fetch(`/api/students?classId=${grade10A.id}`);
          const data = await res.json();
          if (data.success) {
            setStudents(data.students);
          }
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.includes(search) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Class Roster & Student Profiles"
        subtitle="Grade 10 - Section A • Mentor & Class Teacher Overview"
        role="TEACHER"
        userName="Prof. Sarah Jenkins"
      />

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll number..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {filtered.length} Active Mentees
          </span>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <p className="col-span-full py-12 text-center text-xs text-slate-400">Loading student profiles...</p>
          ) : filtered.length === 0 ? (
            <p className="col-span-full py-12 text-center text-xs text-slate-500">No students found.</p>
          ) : (
            filtered.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border border-blue-200">
                      {s.avatar ? <img src={s.avatar} alt={s.name} /> : s.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                      <p className="text-xs text-slate-500">Roll #{s.rollNo} • {s.admissionNo}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Attendance Standing:</span>
                      <span className="font-bold text-emerald-700">{s.attendanceRate}% Present</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Blood Group:</span>
                      <span className="font-semibold text-slate-700">{s.bloodGroup || 'O+'}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Primary Guardian Contact
                      </span>
                      <p className="font-medium text-slate-800">
                        {s.guardianName} ({s.guardianRelation})
                      </p>
                      <div className="flex items-center gap-3 text-slate-500 mt-1">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {s.guardianPhone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Enrolled Active
                  </span>
                  <span>Grade 10-A</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
