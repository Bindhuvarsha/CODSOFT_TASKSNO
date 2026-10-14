'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useToast } from '@/components/ToastProvider';
import {
  Settings,
  School,
  Calendar,
  Award,
  Database,
  Save,
  CheckCircle2,
  Shield,
  Bell,
  Lock,
} from 'lucide-react';

export default function SettingsAdminPage() {
  const { success } = useToast();

  const [institutionName, setInstitutionName] = useState('EduManage International Academy');
  const [affiliationCode, setAffiliationCode] = useState('EDM-9921');
  const [campusEmail, setCampusEmail] = useState('registrar@edumanage.com');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [term, setTerm] = useState('Term 2 - Spring Session');
  const [passingPercentage, setPassingPercentage] = useState('50');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [attendanceThreshold, setAttendanceThreshold] = useState('85');
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Settings Updated', 'Institutional configuration has been saved successfully.');
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Institution Settings & Configuration"
        subtitle="School profiles, academic session schedules, grading rubrics, and database parameters"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
      />

      <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Institution Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <School className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Identity</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Official legal name, accreditation, and administrative contact</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Institution Legal Name *</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Accreditation Code</label>
                <input
                  type="text"
                  value={affiliationCode}
                  onChange={(e) => setAffiliationCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Registrar Email</label>
                <input
                  type="email"
                  value={campusEmail}
                  onChange={(e) => setCampusEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Year Session</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          {/* Academic Policies & Attendance Threshold */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Grading & Attendance Policies</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Benchmark thresholds for attendance warnings and examination qualification</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Minimum Examination Attendance Threshold (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={attendanceThreshold}
                  onChange={(e) => setAttendanceThreshold(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Students below this percentage receive automatic advisory warnings.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Passing Mark Cutoff (%)</label>
                <input
                  type="number"
                  min="30"
                  max="60"
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Scores below this mark are automatically graded as Grade F.</p>
              </div>
            </div>
          </div>

          {/* Database Engine Status */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Database Engine Architecture</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Prisma ORM connection and PostgreSQL / SQLite parameters</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active Engine:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Prisma ORM Client Connected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Supported Drivers:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">PostgreSQL (Production) & SQLite (Local Dev)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Security Encryption:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">bcryptjs Salt Rounds: 10 • JWT Session Cookies</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Preferences...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
