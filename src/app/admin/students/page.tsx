'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import StudentModal from '@/components/StudentModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { useToast } from '@/components/ToastProvider';
import {
  Search,
  UserPlus,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  CalendarCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function StudentsAdminPage() {
  const { success, error } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'enrollmentDate' | 'rollNo'>('rollNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [activeActionDropdown, setActiveActionDropdown] = useState<string | null>(null);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Profile Drawer
  const [viewingStudent, setViewingStudent] = useState<any | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedStatus) params.append('status', selectedStatus);

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
      error('Failed to load students', 'Please check network connection');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      if (data.success) {
        setClasses(data.classes);
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedClass, selectedStatus]);

  // Sorting
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (sortBy === 'rollNo') {
        valA = parseInt(a.rollNo) || 0;
        valB = parseInt(b.rollNo) || 0;
      } else if (sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortBy, sortOrder]);

  // Paginated Slice
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedStudents.slice(start, start + itemsPerPage);
  }, [sortedStudents, currentPage, itemsPerPage]);

  const toggleSort = (field: 'name' | 'enrollmentDate' | 'rollNo') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/students/${studentToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        success('Student Record Deleted', `${studentToDelete.name} was removed from the institutional database.`);
        setDeleteModalOpen(false);
        setStudentToDelete(null);
        fetchStudents();
      } else {
        error('Delete Failed', 'Could not delete student record.');
      }
    } catch (err) {
      error('Error', 'An unexpected error occurred while deleting.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = [
      'Admission No',
      'Roll No',
      'Full Name',
      'Email',
      'Class & Cohort',
      'Gender',
      'Guardian Name',
      'Guardian Phone',
      'Attendance %',
      'Status',
    ];
    const rows = students.map((s) => [
      s.admissionNo,
      s.rollNo,
      `"${s.name}"`,
      s.email,
      `"${s.className}"`,
      s.gender,
      `"${s.guardianName} (${s.guardianRelation})"`,
      s.guardianPhone || 'N/A',
      `${s.attendanceRate}%`,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('CSV Export Ready', `Exported ${students.length} student records.`);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Students Directory"
        subtitle="Manage student profiles, academic standings, guardian information, and admissions"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Search, Filter & Sort Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, ID, roll..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Filter by Class/Department */}
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="">All Cohorts / Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.section}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="GRADUATED">Graduated</option>
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => toggleSort('name')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border transition-all ${
                sortBy === 'name'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort: Name ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})</span>
            </button>
          </div>
        </div>

        {/* Data Table with Loading Skeletons & Horizontal Scroll */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Student Profile</th>
                  <th className="py-3.5 px-3">Student ID</th>
                  <th className="py-3.5 px-3">Class & Section</th>
                  <th className="py-3.5 px-3">Email Address</th>
                  <th className="py-3.5 px-3 text-center">Attendance</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  // Loading Skeletons
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200"></div>
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-slate-200 rounded"></div>
                          <div className="h-2.5 w-16 bg-slate-100 rounded"></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3"><div className="h-3 w-20 bg-slate-200 rounded"></div></td>
                      <td className="py-3.5 px-3"><div className="h-3 w-24 bg-slate-200 rounded"></div></td>
                      <td className="py-3.5 px-3"><div className="h-3 w-32 bg-slate-200 rounded"></div></td>
                      <td className="py-3.5 px-3 text-center"><div className="h-4 w-12 bg-slate-200 rounded mx-auto"></div></td>
                      <td className="py-3.5 px-3 text-center"><div className="h-4 w-16 bg-slate-200 rounded mx-auto"></div></td>
                      <td className="py-3.5 px-4 text-right"><div className="h-6 w-16 bg-slate-200 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : paginatedStudents.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">No students found</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        {search || selectedClass || selectedStatus
                          ? 'Try adjusting your search criteria or clearing filters to view all students.'
                          : 'No student records have been added yet. Click "+ Add Student" to enroll the first student.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => {
                    const initials = s.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Avatar & Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-indigo-200">
                              {s.avatar ? (
                                <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                              ) : (
                                initials
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                              <p className="text-[11px] text-slate-500 font-mono">Roll #{s.rollNo}</p>
                            </div>
                          </div>
                        </td>

                        {/* Student ID */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {s.admissionNo}
                          </span>
                        </td>

                        {/* Class */}
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {s.className}
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-3 text-slate-600">
                          {s.email}
                        </td>

                        {/* Attendance Standing */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                              s.attendanceRate >= 90
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : s.attendanceRate >= 75
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {s.attendanceRate}%
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              s.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.status === 'GRADUATED'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>

                        {/* Actions Menu */}
                        <td className="py-3.5 px-4 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingStudent(s)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="View Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setEditingStudent(s);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Student"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href={`/admin/attendance?classId=${s.classId}`}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="View Attendance"
                            >
                              <CalendarCheck className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => {
                                setStudentToDelete(s);
                                setDeleteModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing {sortedStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedStudents.length)} of {sortedStudents.length} entries
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'border border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Enrollment / Edit Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSuccess={() => {
          success(
            editingStudent ? 'Profile Updated' : 'Student Enrolled',
            'Database records synchronized.'
          );
          fetchStudents();
        }}
        classes={classes}
        initialData={editingStudent}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message="Are you sure you want to permanently remove this student? All attendance sheets, examination scores, and fee records will also be erased."
        itemName={studentToDelete ? `${studentToDelete.name} (${studentToDelete.admissionNo})` : undefined}
        loading={deleting}
      />

      {/* Student Profile Quick Drawer */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm overflow-hidden border border-indigo-200">
                  {viewingStudent.avatar ? (
                    <img src={viewingStudent.avatar} alt={viewingStudent.name} />
                  ) : (
                    viewingStudent.name[0]
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{viewingStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    ID: {viewingStudent.admissionNo} • Roll #{viewingStudent.rollNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Class Cohort</span>
                  <span className="font-bold text-slate-800">{viewingStudent.className}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Attendance Standing</span>
                  <span className="font-bold text-emerald-700">{viewingStudent.attendanceRate}% Present</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Student Email</span>
                  <span className="text-slate-700">{viewingStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Gender & Blood</span>
                  <span className="text-slate-700">{viewingStudent.gender} • {viewingStudent.bloodGroup || 'O+'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
                  Guardian Information
                </span>
                <p className="font-bold text-slate-800">
                  {viewingStudent.guardianName} ({viewingStudent.guardianRelation})
                </p>
                <p className="text-slate-500">{viewingStudent.guardianPhone} • {viewingStudent.guardianEmail || 'N/A'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
                  Tuition Financial Status
                </span>
                <div className="flex justify-between font-semibold">
                  <span>Pending Dues:</span>
                  <span className="text-rose-600 font-mono">{formatCurrency(viewingStudent.pendingFees)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Total Paid:</span>
                  <span className="text-emerald-600 font-mono">{formatCurrency(viewingStudent.paidFees)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/admin/attendance?classId=${viewingStudent.classId}`}
                className="text-indigo-600 font-semibold text-xs hover:underline flex items-center gap-1"
              >
                <span>View Attendance Sheet</span>
              </Link>
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
