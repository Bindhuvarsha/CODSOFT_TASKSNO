'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PrintableReportCard from '@/components/PrintableReportCard';
import { Award, Printer, Download, Sparkles } from 'lucide-react';

export default function StudentResultsPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/students');
        const data = await res.json();
        if (data.success && data.students.length > 0) {
          const detailRes = await fetch(`/api/students/${data.students[0].id}`);
          const detailData = await detailRes.json();
          if (detailData.success) {
            setStudent(detailData.student);
          }
        }
      } catch (err) {
        console.error('Failed to load results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const examResults = student?.examResults || [];
  const attendances = student?.attendances || [];
  const presentCount = attendances.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendanceRate = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 96;

  const mockExam = examResults[0]?.exam || {
    title: 'Spring Midterm Examination 2026',
    academicYear: '2026-2027',
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="no-print">
        <Header
          title="Official Academic Transcript"
          subtitle="Certified digital report card with term-wise grading rubrics and institutional seal"
          role="STUDENT"
          userName="Alex Rivera"
        />
      </div>

      <div className="p-6 max-w-4xl mx-auto w-full">
        {loading ? (
          <p className="py-16 text-center text-xs text-slate-400">Generating academic report card...</p>
        ) : (
          <PrintableReportCard
            student={student}
            exam={mockExam}
            results={examResults}
            attendanceRate={attendanceRate}
          />
        )}
      </div>
    </div>
  );
}
