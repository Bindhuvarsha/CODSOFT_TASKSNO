import React from 'react';
import Sidebar from '@/components/Sidebar';
import QuickRoleSwitcher from '@/components/QuickRoleSwitcher';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuickRoleSwitcher currentRole="ADMIN" />
      <div className="flex-1 flex">
        <Sidebar role="ADMIN" userName="Dr. Eleanor Vance" userEmail="admin@edumanage.com" />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
