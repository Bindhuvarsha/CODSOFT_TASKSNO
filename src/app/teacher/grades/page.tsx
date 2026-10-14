'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Award, Save, Clock, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { calculateGrade } from '@/lib/utils';

export default function TeacherGradesPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [marksList, setMarksList] = useState<{ [studentId: string]: { marks: number; remarks: string } }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [examsRes, classesRes] = await Promise.all([
          fetch('/api/exams'),
          fetch('/api/classes'),
        ]);

        const examsData = await examsRes.json();
        const classesData = await classesRes.json();

        if (examsData.success && examsData.exams.length > 0) {
          setExams(examsData.exams);
          setSelectedExamId(examsData.exams[0].id);
        }

        const grade10A = classesData.classes?.[0];
        if (grade10A && grade10A.subjects.length > 0) {
          setSubjects(grade10A.subjects);
          setSelectedSubjectId(grade10A.subjects[0].id);
        }
      } catch (err) {
        console.error('Failed to load gradebook dependencies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // When exam or subject changes, fetch existing results + class students
  useEffect(() => {
    if (!selectedExamId || !selectedSubjectId) return;

    async function loadMarks() {
      try {
        setLoading(true);
        // Find exam's class
        const exam = exams.find((e) => e.id === selectedExamId);
        const classId = exam?.classId;

        const [studentsRes, resultsRes] = await Promise.all([
          fetch(`/api/students?classId=${classId}`),
          fetch(`/api/exams/results?examId=${selectedExamId}&subjectId=${selectedSubjectId}`),
        ]);

        const studentsJson = await studentsRes.json();
        const resultsJson = await resultsRes.json();

        const resultMap: { [key: string]: any } = {};
        if (resultsJson.success) {
          resultsJson.results.forEach((r: any) => {
            resultMap[r.studentId] = { marks: r.marksObtained, remarks: r.remarks || '' };
          });
        }

        const initialMarks: { [key: string]: { marks: number; remarks: string } } = {};
        (studentsJson.students || []).forEach((s: any) => {
          initialMarks[s.id] = resultMap[s.id] || { marks: 85, remarks: '' };
        });

        setStudents(studentsJson.students || []);
        setMarksList(initialMarks);
      } catch (err) {
        console.error('Failed to fetch marks:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMarks();
  }, [selectedExamId, selectedSubjectId, exams]);

  const handleMarkChange = (studentId: string, marks: number) => {
    setMarksList((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: Math.min(100, Math.max(0, marks)),
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksList((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSaveGrades = async () => {
    try {
      setSaving(true);
      const payload = Object.entries(marksList).map(([studentId, data]) => ({
        studentId,
        marksObtained: data.marks,
        maxMarks: 100,
        remarks: data.remarks,
      }));

      const res = await fetch('/api/exams/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: selectedExamId,
          subjectId: selectedSubjectId,
          marksList: payload,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving grades:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Gradebook & Assessment Entry"
        subtitle="Subject scoring, GPA calculations, and academic evaluation"
        role="TEACHER"
        userName="Prof. Sarah Jenkins"
        actions={
          <button
            onClick={handleSaveGrades}
            disabled={saving || students.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'Grades Published!' : 'Publish Marks'}</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Selectors Bar */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Select Assessment
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.class?.name} - {ex.class?.section})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Course Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} [{s.code}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Grading Standard</span>
            <span className="text-xs font-bold text-slate-800">100-Point Scale (A+ to F)</span>
          </div>
        </div>

        {/* Gradebook Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-4 text-center">Score (Max 100)</th>
                  <th className="py-3 px-3 text-center">Calculated Grade</th>
                  <th className="py-3 px-4">Feedback / Assessment Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Loading gradebook roster...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      No students enrolled.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => {
                    const current = marksList[s.id] || { marks: 80, remarks: '' };
                    const { grade, color } = calculateGrade(current.marks, 100);

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 font-mono">#{s.rollNo}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{s.admissionNo}</td>

                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={current.marks}
                            onChange={(e) => handleMarkChange(s.id, Number(e.target.value))}
                            className="w-20 px-2 py-1 text-center font-bold font-mono text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded font-bold text-xs border ${color}`}
                          >
                            {grade}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={current.remarks}
                            onChange={(e) => handleRemarksChange(s.id, e.target.value)}
                            placeholder="e.g. Strong conceptual grasp, excellent problem solving..."
                            className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 focus:bg-white"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Grading {students.length} students for {subjects.find((s) => s.id === selectedSubjectId)?.name}
            </span>
            <button
              onClick={handleSaveGrades}
              disabled={saving}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              {saving ? 'Publishing...' : 'Save & Publish Marks'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
