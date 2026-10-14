'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TeacherModal from '@/components/TeacherModal';
import {
  Users,
  UserPlus,
  Search,
  BookOpen,
  Mail,
  Phone,
  GraduationCap,
  Layers,
  Edit2,
  Trash2,
  Award,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TeachersAdminPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (department) params.append('department', department);

      const res = await fetch(`/api/teachers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, department]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove faculty member ${name}?`)) return;
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTeachers();
    } catch (err) {
      console.error('Failed to delete teacher:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Faculty & Teachers Directory"
        subtitle="Manage academic departments, appointed professors, and instructional assignments"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <button
            onClick={() => {
              setEditingTeacher(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Appoint Faculty</span>
          </button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Search & Filter */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name, employee ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              <option value="Mathematics & Computing">Mathematics & Computing</option>
              <option value="Physical Sciences">Physical Sciences</option>
              <option value="Humanities & Literature">Humanities & Literature</option>
            </select>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <p className="col-span-full py-12 text-center text-xs text-slate-400 dark:text-slate-500">Loading faculty roster...</p>
          ) : teachers.length === 0 ? (
            <p className="col-span-full py-12 text-center text-xs text-slate-500 dark:text-slate-400">No faculty members found.</p>
          ) : (
            teachers.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border border-blue-200 dark:border-blue-800/60">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          t.name[0]
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 inline-block mt-0.5">
                          {t.employeeId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingTeacher(t);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Faculty"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        title="Remove Faculty"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold block">Department</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t.department}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold block">Designation & Degree</span>
                      <span className="text-slate-700 dark:text-slate-300">{t.designation} • {t.qualification}</span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1 truncate text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        {t.email}
                      </span>
                      {t.phone && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          {t.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned Classes / Subjects */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold block mb-1.5">
                    Assigned Classes & Courses
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.classes.length > 0 &&
                      t.classes.map((clsName: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold"
                        >
                          In-charge: {clsName}
                        </span>
                      ))}

                    {t.subjects.length > 0 ? (
                      t.subjects.map((sub: any) => (
                        <span
                          key={sub.id}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                        >
                          {sub.name} ({sub.code})
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">No subject courses mapped</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTeacher(null);
        }}
        onSuccess={fetchTeachers}
        initialData={editingTeacher}
      />
    </div>
  );
}
