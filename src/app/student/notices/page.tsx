'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Bell, Pin, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StudentNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true);
        const res = await fetch('/api/notices?role=STUDENT');
        const data = await res.json();
        if (data.success) {
          setNotices(data.notices);
        }
      } catch (err) {
        console.error('Failed to load notices:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotices();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="School Noticeboard & Circulars"
        subtitle="Academic notifications, examination notices, event announcements, and fee deadlines"
        role="STUDENT"
        userName="Alex Rivera"
      />

      <div className="p-6 space-y-4 max-w-4xl">
        {loading ? (
          <p className="py-12 text-center text-xs text-slate-400">Loading student announcements...</p>
        ) : notices.length === 0 ? (
          <p className="py-12 text-center text-xs text-slate-500">No active circulars.</p>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-shadow ${
                n.pinned ? 'border-amber-300 ring-1 ring-amber-300/30' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {n.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      <Pin className="w-3 h-3 text-amber-700" />
                      Pinned
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    {n.category}
                  </span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(n.createdAt)}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">{n.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{n.content}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Official announcement from {n.author?.name || 'Administration Desk'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
