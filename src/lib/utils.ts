import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateGrade(marks: number, maxMarks: number = 100): { grade: string; color: string; gpa: number } {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return { grade: 'A+', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', gpa: 4.0 };
  if (percentage >= 80) return { grade: 'A', color: 'text-green-700 bg-green-50 border-green-200', gpa: 3.7 };
  if (percentage >= 70) return { grade: 'B+', color: 'text-blue-700 bg-blue-50 border-blue-200', gpa: 3.3 };
  if (percentage >= 60) return { grade: 'B', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', gpa: 3.0 };
  if (percentage >= 50) return { grade: 'C', color: 'text-amber-700 bg-amber-50 border-amber-200', gpa: 2.0 };
  if (percentage >= 40) return { grade: 'D', color: 'text-orange-700 bg-orange-50 border-orange-200', gpa: 1.0 };
  return { grade: 'F', color: 'text-rose-700 bg-rose-50 border-rose-200', gpa: 0.0 };
}

export function getAttendanceBadge(status: string) {
  switch (status.toUpperCase()) {
    case 'PRESENT':
      return { label: 'Present', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'LATE':
      return { label: 'Late', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'EXCUSED':
      return { label: 'Excused', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'ABSENT':
    default:
      return { label: 'Absent', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  }
}

export function getFeeStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case 'PAID':
      return { label: 'Paid', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'PARTIAL':
      return { label: 'Partial', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'OVERDUE':
      return { label: 'Overdue', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    case 'PENDING':
    default:
      return { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
}
