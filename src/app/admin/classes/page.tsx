'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Layers, Plus, BookOpen, Users, UserCheck, DoorOpen, Sparkles, Check } from 'lucide-react';

export default function ClassesAdminPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Class Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [room, setRoom] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [classTeacherId, setClassTeacherId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClassesAndTeachers = async () => {
    try {
      setLoading(true);
      const [classRes, teacherRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/teachers'),
      ]);
      const classData = await classRes.json();
      const teacherData = await teacherRes.json();

      if (classData.success) setClasses(classData.classes);
      if (teacherData.success) setTeachers(teacherData.teachers);
    } catch (err) {
      console.error('Failed to load classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndTeachers();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: className,
          section,
          room,
          academicYear,
          classTeacherId: classTeacherId || undefined,
        }),
      });

      if (res.ok) {
        setShowAddForm(false);
        setClassName('');
        setSection('');
        setRoom('');
        fetchClassesAndTeachers();
      }
    } catch (err) {
      console.error('Error creating class:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Classes & Academic Courses"
        subtitle="Manage grade cohorts, section capacities, and subject syllabi"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Form' : 'Add New Class'}</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Collapsible Add Class Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-brand-200 p-6 shadow-md animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Configure New Academic Section
            </h3>
            <p className="text-xs text-slate-500 mb-4">Define class grade, section code, and appoint class teacher</p>

            <form onSubmit={handleCreateClass} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Grade *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 9, Grade 11"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Section *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A, B, STEM"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Hall</label>
                <input
                  type="text"
                  placeholder="Room 204"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Teacher</label>
                <select
                  value={classTeacherId}
                  onChange={(e) => setClassTeacherId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                >
                  <option value="">Assign Later...</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  {submitting ? 'Creating...' : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Classes Roster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p className="col-span-full py-12 text-center text-xs text-slate-400">Loading academic classes...</p>
          ) : classes.length === 0 ? (
            <p className="col-span-full py-12 text-center text-xs text-slate-500">No classes registered.</p>
          ) : (
            classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">
                        {cls.name} <span className="text-brand-600 font-bold">- Section {cls.section}</span>
                      </h4>
                      <p className="text-xs text-slate-500">Academic Session: {cls.academicYear}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {cls._count.students} Students
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Class In-Charge
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {cls.classTeacher?.user?.name || 'Unassigned'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold flex items-center gap-1">
                      <DoorOpen className="w-3 h-3" />
                      Location
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">{cls.room || 'Main Academic Hall'}</p>
                  </div>
                </div>

                {/* Course Subjects */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-2">
                    Enrolled Subject Curriculum ({cls.subjects.length})
                  </span>
                  <div className="space-y-1.5">
                    {cls.subjects.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{sub.name}</span>
                          <span className="font-mono text-[10px] text-slate-500">[{sub.code}]</span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {sub.teacher?.user?.name || 'Faculty Assigned'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
