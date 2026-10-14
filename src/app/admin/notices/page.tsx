'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  Bell,
  Plus,
  Pin,
  Calendar,
  AlertCircle,
  Megaphone,
  Sparkles,
  Send,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function NoticesAdminPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ACADEMIC');
  const [targetRole, setTargetRole] = useState('ALL');
  const [pinned, setPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notices');
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          targetRole,
          pinned,
        }),
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setPinned(false);
        setShowForm(false);
        fetchNotices();
      }
    } catch (err) {
      console.error('Failed to post notice:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const categoryColors: { [key: string]: string } = {
    EXAM: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    ACADEMIC: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    URGENT: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    GENERAL: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    HOLIDAY: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    SPORTS: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Noticeboard & Circulars"
        subtitle="School-wide broadcasts, academic calendars, and targeted role announcements"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showForm ? 'Cancel' : 'Broadcast Announcement'}</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Publish Form */}
        {showForm && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-brand-200 dark:border-slate-800 p-6 shadow-md animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Compose New Official Announcement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select target audience, category urgency, and pin status
            </p>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Headline *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spring 2026 Examination Schedule Released"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="EXAM">EXAMINATION</option>
                    <option value="URGENT">URGENT REMINDER</option>
                    <option value="GENERAL">GENERAL NOTIFICATION</option>
                    <option value="HOLIDAY">HOLIDAY CIRCULAR</option>
                    <option value="SPORTS">SPORTS & CULTURE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="ALL">Everyone (Public Noticeboard)</option>
                    <option value="TEACHER">Faculty & Teachers Only</option>
                    <option value="STUDENT">Students & Guardians Only</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 focus:ring-brand-500"
                    />
                    <span>Pin to top of noticeboard</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Description *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the full announcement text, instructions, and deadlines..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Broadcasting...' : 'Publish Announcement'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notices Feed */}
        <div className="space-y-4">
          {loading ? (
            <p className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">Loading school circulars...</p>
          ) : notices.length === 0 ? (
            <p className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">No active announcements posted.</p>
          ) : (
            notices.map((n) => {
              const badgeStyle = categoryColors[n.category] || categoryColors.GENERAL;

              return (
                <div
                  key={n.id}
                  className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-xs transition-shadow ${
                    n.pinned ? 'border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400/30' : 'border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {n.pinned && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Pin className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                          Pinned
                        </span>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeStyle}`}>
                        {n.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Audience: {n.targetRole}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(n.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2.5 mb-1.5">{n.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{n.content}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>Published by {n.author?.name || 'Administrator'}</span>
                    <span>EduManage Broadcast Service</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
