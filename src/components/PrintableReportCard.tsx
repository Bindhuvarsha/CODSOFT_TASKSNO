'use client';

import React from 'react';
import { Printer, Download, Award, CheckCircle } from 'lucide-react';
import { calculateGrade } from '@/lib/utils';

interface ReportCardProps {
  student: any;
  exam: any;
  results: Array<{
    subject: { name: string; code: string };
    marksObtained: number;
    maxMarks: number;
    grade: string;
    remarks?: string | null;
  }>;
  attendanceRate?: number;
}

export default function PrintableReportCard({
  student,
  exam,
  results,
  attendanceRate = 96,
}: ReportCardProps) {
  const totalObtained = results.reduce((sum, r) => sum + r.marksObtained, 0);
  const totalMax = results.reduce((sum, r) => sum + r.maxMarks, 0);
  const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  const overallGrade = calculateGrade(totalObtained, totalMax);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-6 md:p-8">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">Academic Performance Statement</h3>
          <p className="text-xs text-slate-500">Official digital transcript issued by EduManage</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Institutional Letterhead */}
      <div className="text-center pb-6 border-b-2 border-slate-900">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white font-bold text-xl mb-2 shadow-md">
          EM
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          EduManage International Academy
        </h1>
        <p className="text-xs text-slate-600 font-medium">
          Accredited by National Board of Secondary & Higher Education • Affiliation Code: EDM-9921
        </p>
        <div className="mt-2 inline-block px-3 py-1 bg-brand-50 border border-brand-200 rounded-full text-xs font-bold text-brand-800 uppercase tracking-wider">
          Official Report Card & Transcript
        </div>
      </div>

      {/* Student & Examination Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block uppercase font-medium text-[10px]">Student Name</span>
          <span className="font-bold text-slate-900 text-sm">{student?.user?.name || student?.name}</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-medium text-[10px]">Admission No.</span>
          <span className="font-bold text-slate-900">{student?.admissionNo}</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-medium text-[10px]">Class & Roll</span>
          <span className="font-bold text-slate-900">
            {student?.class?.name} - {student?.class?.section} (Roll #{student?.rollNo})
          </span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-medium text-[10px]">Examination Title</span>
          <span className="font-bold text-slate-900">{exam?.title || 'Midterm Assessment 2026'}</span>
        </div>
      </div>

      {/* Subject Grades Table */}
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Subject Name</th>
              <th className="py-3 px-3">Subject Code</th>
              <th className="py-3 px-3 text-center">Max Marks</th>
              <th className="py-3 px-3 text-center">Marks Obtained</th>
              <th className="py-3 px-3 text-center">Grade</th>
              <th className="py-3 px-4">Faculty Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {results.map((res, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">{res.subject.name}</td>
                <td className="py-3 px-3 font-mono text-slate-500">{res.subject.code}</td>
                <td className="py-3 px-3 text-center font-medium text-slate-600">{res.maxMarks}</td>
                <td className="py-3 px-3 text-center font-bold text-slate-900">{res.marksObtained}</td>
                <td className="py-3 px-3 text-center">
                  <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-slate-100 border border-slate-300">
                    {res.grade}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 italic">
                  {res.remarks || 'Satisfactory performance and active class participation.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Aggregate Score Card */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/90 text-center">
        <div>
          <p className="text-[10px] uppercase font-semibold text-slate-500">Total Score</p>
          <p className="text-xl font-black text-slate-900 mt-0.5">
            {totalObtained} / {totalMax}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase font-semibold text-slate-500">Aggregate Percentage</p>
          <p className="text-xl font-black text-brand-700 mt-0.5">{percentage}%</p>
        </div>

        <div>
          <p className="text-[10px] uppercase font-semibold text-slate-500">Overall Grade</p>
          <p className="text-xl font-black text-emerald-600 mt-0.5">{overallGrade.grade}</p>
        </div>

        <div>
          <p className="text-[10px] uppercase font-semibold text-slate-500">Attendance Record</p>
          <p className="text-xl font-black text-indigo-700 mt-0.5">{attendanceRate}% Present</p>
        </div>
      </div>

      {/* Signatures & Seal */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex items-end justify-between text-xs text-slate-600">
        <div className="text-center">
          <div className="w-40 border-b border-slate-400 mb-1"></div>
          <p className="font-semibold text-slate-800">Prof. Sarah Jenkins</p>
          <p className="text-[10px] text-slate-500">Class In-Charge</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 mx-auto mb-1">
            Official Seal
          </div>
          <p className="text-[10px] text-slate-500">EduManage Registrar</p>
        </div>

        <div className="text-center">
          <div className="w-40 border-b border-slate-400 mb-1"></div>
          <p className="font-semibold text-slate-800">Dr. Eleanor Vance</p>
          <p className="text-[10px] text-slate-500">Head of Institution / Principal</p>
        </div>
      </div>
    </div>
  );
}
