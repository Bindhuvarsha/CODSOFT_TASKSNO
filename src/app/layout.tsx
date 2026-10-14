import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduManage - Modern Student & Education Management Platform',
  description: 'Enterprise full-stack education platform for managing students, faculty, attendance, examinations, fee collection, and academic records.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
