import React from 'react';
import Sidebar from '@/components/Sidebar';
import QuickRoleSwitcher from '@/components/QuickRoleSwitcher';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuickRoleSwitcher currentRole="TEACHER" />
      <div className="flex-1 flex">
        <Sidebar
          role="TEACHER"
          userName="Prof. Sarah Jenkins"
          userEmail="sarah.jenkins@edumanage.com"
        />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
