import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ShieldCheck,
  School,
  GraduationCap,
  CalendarCheck,
  Award,
  CreditCard,
  Users,
  CheckCircle2,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';
import QuickRoleSwitcher from '@/components/QuickRoleSwitcher';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Banner Role Switcher */}
      <QuickRoleSwitcher />

      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">EduManage</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Institutional OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/20 transition-all"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            CODSOFT Task 1: Student Management System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            A Full-Stack Education Management Platform for Modern Institutions.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            EduManage digitizes the complete academic workflow—replacing manual paper-based student records
            with centralized attendance, examinations, fee collection, and role-based portals for students,
            teachers, and administrators.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Explore Administrator Portal</span>
            </Link>

            <Link
              href="/teacher"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition-all transform hover:-translate-y-0.5"
            >
              <School className="w-4 h-4 text-blue-600" />
              <span>Explore Teacher Portal</span>
            </Link>

            <Link
              href="/student"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition-all transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Explore Student Portal</span>
            </Link>
          </div>

          {/* Tech Stack Pills */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Built With:</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium">Next.js 14 App Router</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium">Node.js</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium">PostgreSQL / SQLite</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium">Prisma ORM</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium">Tailwind CSS</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium">TypeScript</span>
          </div>
        </div>
      </section>

      {/* Role-Based Portals Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dedicated Dashboards with Role-Based Access
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Each stakeholder experiences a tailored interface built specifically for their institutional workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-purple-100 hover:border-purple-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Administrator
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Executive Governance</h3>
                <p className="text-xs text-slate-600 mt-1 mb-4">
                  Oversee all academic operations, enroll students, hire teachers, configure classes, monitor institution-wide attendance, fee revenue, and audit trails.
                </p>

                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    Student & Faculty Lifecycle CRUD
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    Financial Invoicing & Payment Auditing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    Overall Attendance & Grade Distribution
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100">
                <Link
                  href="/admin"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors"
                >
                  <span>Open Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <School className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Teacher / Faculty
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Classroom & Academic Mastery</h3>
                <p className="text-xs text-slate-600 mt-1 mb-4">
                  Mark daily attendance in seconds, manage subject curriculum, record examination scores, auto-compute GPAs, and post notices.
                </p>

                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    Fast One-Click Class Attendance Sheet
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    Exam Marks Entry & Automated Grading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    Student Profile & Guardian Details Access
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100">
                <Link
                  href="/teacher"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  <span>Open Teacher Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Student Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-emerald-100 hover:border-emerald-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Student & Guardian
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Academic Transparency</h3>
                <p className="text-xs text-slate-600 mt-1 mb-4">
                  Real-time visibility into attendance records, official report cards, fee invoice settlement, and school-wide announcements.
                </p>

                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Live Attendance Calendar & Stats
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Printable Official Report Card Transcripts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Online Fee Payments & Digital Receipts
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100">
                <Link
                  href="/student"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  <span>Open Student Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Institutional Modules
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Designed from the ground up to solve paper-based inefficiencies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Student & Faculty Records</h4>
              <p className="text-xs text-slate-500 mt-1">
                Centralized registry with admission numbers, roll codes, contact information, and guardian credentials.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Attendance Intelligence</h4>
              <p className="text-xs text-slate-500 mt-1">
                Interactive daily attendance recording (Present, Late, Absent, Excused) with automated percentage alerts.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Exams & Grading System</h4>
              <p className="text-xs text-slate-500 mt-1">
                Schedule midterm and final assessments, enter subject marks, auto-compute letter grades (A+ to F), and export report cards.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Fee Collection & Invoicing</h4>
              <p className="text-xs text-slate-500 mt-1">
                Generate itemized tuition invoices, track pending/overdue balances, simulate card/UPI payments, and download receipts.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Curriculum & Class Sections</h4>
              <p className="text-xs text-slate-500 mt-1">
                Organize academic grades, section capacities, subjects, and classroom teacher in-charge allocations.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Prisma & SQL Architecture</h4>
              <p className="text-xs text-slate-500 mt-1">
                Strict relational data integrity, seeded demo data, full type safety, and seamless support for PostgreSQL and SQLite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-white">EduManage Platform</span>
            <span>• CODSOFT Internship Task 1</span>
          </div>
          <div>Designed and developed with Next.js, Node.js, Prisma & PostgreSQL</div>
        </div>
      </footer>
    </div>
  );
}
