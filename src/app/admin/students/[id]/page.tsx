'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PrintableReportCard from '@/components/PrintableReportCard';
import {
  ArrowLeft,
  User,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Award,
  Phone,
  Mail,
  Printer,
  Edit2,
  Trash2,
} from 'lucide-react';
import { formatCurrency, formatDate, getAttendanceBadge, getFeeStatusBadge } from '@/lib/utils';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'results' | 'fees'>('overview');

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/students/${id}`);
        const data = await res.json();
        if (data.success) {
          setStudent(data.student);
        }
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col p-8 items-center justify-center text-slate-400 text-xs">
        Loading student dossier...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex-1 flex flex-col p-8 items-center justify-center text-slate-500 text-xs">
        <p>Student record not found.</p>
        <Link href="/admin/students" className="mt-2 text-indigo-600 font-semibold hover:underline">
          ← Back to Students Directory
        </Link>
      </div>
    );
  }

  const attendances = student.attendances || [];
  const presentCount = attendances.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendanceRate = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 95;

  const results = student.examResults || [];
  const fees = student.fees || [];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={`${student.user.name}`}
        subtitle={`Student Profile • ${student.class.name} - ${student.class.section} • Roll #${student.rollNo}`}
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <Link
            href="/admin/students"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Profile Card Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-bold text-xl flex items-center justify-center overflow-hidden shrink-0">
              {student.user.avatar ? (
                <img src={student.user.avatar} alt={student.user.name} className="w-full h-full object-cover" />
              ) : (
                student.user.name[0]
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{student.user.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Admission ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{student.admissionNo}</span> • Roll #{student.rollNo}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Enrolled on {formatDate(student.enrollmentDate)} • Class: {student.class.name} - {student.class.section}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-center">
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Attendance</span>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{attendanceRate}%</p>
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Graded Exams</span>
              <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mt-0.5">{results.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Personal & Guardian Info
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'attendance'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Attendance Register ({attendances.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'results'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Academic Transcript ({results.length})
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'fees'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Fee Ledger ({fees.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Personal Credentials
              </h3>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-slate-400 dark:text-slate-500">Date of Birth:</span>
                <span className="font-semibold">{formatDate(student.dateOfBirth)}</span>
                <span className="text-slate-400 dark:text-slate-500">Gender:</span>
                <span className="font-semibold">{student.gender}</span>
                <span className="text-slate-400 dark:text-slate-500">Blood Group:</span>
                <span className="font-semibold">{student.bloodGroup || 'O+'}</span>
                <span className="text-slate-400 dark:text-slate-500">Student Phone:</span>
                <span className="font-semibold">{student.phone || 'N/A'}</span>
                <span className="text-slate-400 dark:text-slate-500">Home Address:</span>
                <span className="font-semibold">{student.address || 'City Campus Housing'}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Guardian & Family Contact
              </h3>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-slate-400 dark:text-slate-500">Guardian Name:</span>
                <span className="font-semibold">{student.guardianName}</span>
                <span className="text-slate-400 dark:text-slate-500">Relationship:</span>
                <span className="font-semibold">{student.guardianRelation}</span>
                <span className="text-slate-400 dark:text-slate-500">Emergency Phone:</span>
                <span className="font-semibold font-mono">{student.guardianPhone}</span>
                <span className="text-slate-400 dark:text-slate-500">Email Address:</span>
                <span className="font-semibold">{student.guardianEmail || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Instructor Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendances.map((att: any) => {
                  const badge = getAttendanceBadge(att.status);
                  return (
                    <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-bold font-mono text-slate-900 dark:text-white">{formatDate(att.date)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 italic">{att.remarks || 'Standard session logged'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Exam Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 text-center">Marks</th>
                  <th className="py-3 px-4 text-center">Letter Grade</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{r.exam.title}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{r.subject.name} [{r.subject.code}]</td>
                    <td className="py-3 px-4 text-center font-bold font-mono text-slate-900 dark:text-white">{r.marksObtained} / {r.maxMarks}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">{r.grade}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 italic">{r.remarks || 'Satisfactory'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fees.map((f: any) => {
                  const badge = getFeeStatusBadge(f.status);
                  return (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{f.invoiceNumber}</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{f.title}</td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(f.amount)}</td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(f.paidAmount)}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{formatDate(f.dueDate)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
