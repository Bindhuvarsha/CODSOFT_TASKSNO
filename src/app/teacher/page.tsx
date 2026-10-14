'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import {
  CalendarCheck,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const [classData, setClassData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacherData() {
      try {
        const [classesRes, studentsRes, examsRes] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/students'),
          fetch('/api/exams'),
        ]);

        const classesJson = await classesRes.json();
        const studentsJson = await studentsRes.json();
        const examsJson = await examsRes.json();

        if (classesJson.success && classesJson.classes.length > 0) {
          // Default to Grade 10-A (Sarah Jenkins' class)
          setClassData(classesJson.classes[0]);
        }
        if (studentsJson.success) {
          setStudents(studentsJson.students);
        }
        if (examsJson.success) {
          setExams(examsJson.exams);
        }
      } catch (err) {
        console.error('Failed to load teacher dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeacherData();
  }, []);

  const classStudents = students.filter((s) => s.classId === classData?.id);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Faculty Workspace"
        subtitle="Instructional planning, daily class roll call, and examination grading"
        role="TEACHER"
        userName="Prof. Sarah Jenkins"
        actions={
          <Link
            href="/teacher/attendance"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Daily Attendance</span>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Department of Mathematics & Computing
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-2">
              Welcome back, Prof. Sarah Jenkins!
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              You are assigned as Class In-Charge for{' '}
              <strong className="text-white">Grade 10 - Section A (North Wing 101)</strong>. You have 2 scheduled
              classes today and mid-term exam marks waiting to be finalized.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link
                href="/teacher/attendance"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                Open Today's Roll Call
              </Link>
              <Link
                href="/teacher/grades"
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
              >
                Enter Exam Marks
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Class Students"
            value={classStudents.length || 5}
            subtitle="Grade 10 - Section A"
            icon={Users}
            color="blue"
          />

          <StatCard
            title="Class Attendance Rate"
            value="94%"
            subtitle="Past 14 school days"
            icon={CalendarCheck}
            trend={{ value: 'Above target', isPositive: true }}
            color="emerald"
          />

          <StatCard
            title="Teaching Courses"
            value="2 Subjects"
            subtitle="Math 101 & CS 101"
            icon={BookOpen}
            color="purple"
          />

          <StatCard
            title="Upcoming Examinations"
            value={exams.length || 2}
            subtitle="Spring Assessment Schedule"
            icon={Award}
            color="amber"
          />
        </div>

        {/* Main Grid: My Class Students & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Students Roster */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assigned Cohort: Grade 10 - Section A</h3>
                <p className="text-xs text-slate-500">Active students under your direct mentorship</p>
              </div>
              <Link
                href="/teacher/students"
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>Full Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {classStudents.slice(0, 5).map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs overflow-hidden border border-blue-200">
                      {s.avatar ? <img src={s.avatar} alt={s.name} /> : s.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{s.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Roll #{s.rollNo} • {s.admissionNo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                        Attendance
                      </span>
                      <span className="font-bold text-emerald-700">{s.attendanceRate}%</span>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Guardian</span>
                      <span className="text-slate-700">{s.guardianName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Schedule & Tasks */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Today's Academic Schedule</h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Period 1 • 09:00 - 10:30 AM</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">Advanced Mathematics (MATH-101)</h4>
                <p className="text-[11px] text-slate-500">Room 101 - North Wing • Topic: Quadratic Polynomials</p>
              </div>

              <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-100">
                <span className="text-[10px] font-bold text-purple-700 uppercase">Period 3 • 11:45 - 01:15 PM</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">Computer Science & Algorithms (CS-101)</h4>
                <p className="text-[11px] text-slate-500">Tech Lab 2 • Topic: Relational Database Models</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Period 5 • 03:00 - 04:00 PM</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">Student Mentorship & Office Hours</h4>
                <p className="text-[11px] text-slate-500">Faculty Office 14B • Open Consultation</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/teacher/grades"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Go to Gradebook Entry</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
