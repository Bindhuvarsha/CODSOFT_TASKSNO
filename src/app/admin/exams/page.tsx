'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PrintableReportCard from '@/components/PrintableReportCard';
import {
  Award,
  Calendar,
  Plus,
  BookOpen,
  CheckCircle,
  FileText,
  User,
  GraduationCap,
  Sparkles,
  Layers,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ExamsAdminPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Exam Form Modal
  const [showNewExamModal, setShowNewExamModal] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examType, setExamType] = useState('MIDTERM');
  const [examClassId, setExamClassId] = useState('');
  const [startDate, setStartDate] = useState('2026-03-10');
  const [endDate, setEndDate] = useState('2026-03-20');
  const [submitting, setSubmitting] = useState(false);

  // Report Card Modal
  const [selectedStudentReport, setSelectedStudentReport] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examRes, classRes] = await Promise.all([
        fetch('/api/exams'),
        fetch('/api/classes'),
      ]);

      const examData = await examRes.json();
      const classData = await classRes.json();

      if (examData.success) {
        setExams(examData.exams);
        if (examData.exams.length > 0 && !selectedExamId) {
          setSelectedExamId(examData.exams[0].id);
        }
      }

      if (classData.success) {
        setClasses(classData.classes);
        if (classData.classes.length > 0) setExamClassId(classData.classes[0].id);
      }
    } catch (err) {
      console.error('Failed to load examinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch results when selectedExamId changes
  useEffect(() => {
    if (!selectedExamId) return;
    async function fetchResults() {
      try {
        const res = await fetch(`/api/exams/results?examId=${selectedExamId}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (err) {
        console.error('Failed to load results:', err);
      }
    }
    fetchResults();
  }, [selectedExamId]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: examTitle,
          examType,
          classId: examClassId,
          startDate,
          endDate,
        }),
      });

      if (res.ok) {
        setShowNewExamModal(false);
        setExamTitle('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create exam:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Examinations & Academic Grading"
        subtitle="Midterm, final, and formative assessments with automated grade calculation"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <button
            onClick={() => setShowNewExamModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Examination</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Examinations Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exams.map((ex) => {
            const isSelected = ex.id === selectedExamId;
            return (
              <div
                key={ex.id}
                onClick={() => setSelectedExamId(ex.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-700">
                    {ex.examType}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {ex._count?.results || 0} Graded Entries
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mt-2">{ex.title}</h4>
                <p className="text-xs text-brand-700 font-semibold mt-0.5">
                  Cohort: {ex.class?.name} - {ex.class?.section}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(ex.startDate)} - {formatDate(ex.endDate)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Exam Results Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                Score Register: {selectedExam?.title || 'Examination Results'}
              </h3>
              <p className="text-xs text-slate-500">
                Class: {selectedExam?.class?.name} - {selectedExam?.class?.section} • Academic Session 2026-2027
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3 text-center">Score / Max</th>
                  <th className="py-3 px-3 text-center">Letter Grade</th>
                  <th className="py-3 px-4">Instructor Feedback</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      No marks recorded for this examination yet. Switch to Teacher Portal to submit marks.
                    </td>
                  </tr>
                ) : (
                  results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {r.student.user.name}
                        <span className="text-[10px] text-slate-400 font-mono ml-1.5">
                          (Roll #{r.student.rollNo})
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800">{r.subject.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-1">[{r.subject.code}]</span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                        {r.marksObtained} / {r.maxMarks}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {r.grade}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 italic">
                        {r.remarks || 'Competent comprehension.'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            // Collect all results for this student
                            const studentResults = results.filter((res) => res.studentId === r.studentId);
                            setSelectedStudentReport({
                              student: r.student,
                              exam: r.exam,
                              results: studentResults,
                            });
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-md transition-colors"
                        >
                          View Transcript
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Schedule Exam Modal */}
      {showNewExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Schedule New Examination</h3>
              <button
                onClick={() => setShowNewExamModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Examination Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Spring 2026"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Type</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    <option value="MIDTERM">MIDTERM</option>
                    <option value="FINAL">FINAL</option>
                    <option value="UNIT_TEST">UNIT TEST</option>
                    <option value="QUIZ">QUIZ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class *</label>
                  <select
                    value={examClassId}
                    onChange={(e) => setExamClassId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewExamModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
                >
                  {submitting ? 'Scheduling...' : 'Publish Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Transcript Modal */}
      {selectedStudentReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl my-8 relative">
            <button
              onClick={() => setSelectedStudentReport(null)}
              className="no-print absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold hover:bg-slate-700"
            >
              ✕
            </button>
            <PrintableReportCard
              student={selectedStudentReport.student}
              exam={selectedStudentReport.exam}
              results={selectedStudentReport.results}
            />
          </div>
        </div>
      )}
    </div>
  );
}
