'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FeePaymentModal from '@/components/FeePaymentModal';
import {
  CreditCard,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Download,
} from 'lucide-react';
import { formatCurrency, formatDate, getFeeStatusBadge } from '@/lib/utils';

export default function FeesAdminPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('Second Term Tuition Fee');
  const [feeType, setFeeType] = useState('TUITION');
  const [amount, setAmount] = useState('1450');
  const [dueDate, setDueDate] = useState('2026-05-15');
  const [creating, setCreating] = useState(false);

  const fetchFeesData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const [feesRes, statsRes, studentsRes] = await Promise.all([
        fetch(`/api/fees?${params.toString()}`),
        fetch('/api/fees/stats'),
        fetch('/api/students'),
      ]);

      const feesJson = await feesRes.json();
      const statsJson = await statsRes.json();
      const studentsJson = await studentsRes.json();

      if (feesJson.success) setInvoices(feesJson.invoices);
      if (statsJson.success) setStats(statsJson.stats);
      if (studentsJson.success) {
        setStudents(studentsJson.students);
        if (studentsJson.students.length > 0 && !targetStudentId) {
          setTargetStudentId(studentsJson.students[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load fee data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeesData();
    }, 200);
    return () => clearTimeout(timer);
  }, [statusFilter, search]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: targetStudentId,
          title: invoiceTitle,
          feeType,
          amount: Number(amount),
          dueDate,
        }),
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        fetchFeesData();
      }
    } catch (err) {
      console.error('Failed to create invoice:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Tuition & Fee Management"
        subtitle="Itemized billing, accounts receivable, and automated digital receipts"
        role="ADMIN"
        userName="Dr. Eleanor Vance"
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Fee Invoice</span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Billed</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {formatCurrency(stats?.totalBilled || 0)}
            </p>
            <span className="text-[10px] text-slate-500">{stats?.counts?.total || 0} Total Invoices</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Collected</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {formatCurrency(stats?.totalCollected || 0)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">
              {stats?.collectionRate || 0}% Collection Efficiency
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Outstanding Dues</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {formatCurrency(stats?.pendingDues || 0)}
            </p>
            <span className="text-[10px] text-amber-600 font-medium">
              {stats?.counts?.pending || 0} Pending Settlements
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Overdue Balance</span>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {stats?.counts?.overdue || 0}
            </p>
            <span className="text-[10px] text-rose-600 font-medium">Overdue Invoices</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice number, student..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="">All Payment Statuses</option>
              <option value="PAID">PAID</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="PENDING">PENDING</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Student & Cohort</th>
                  <th className="py-3 px-3">Fee Particulars</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Paid</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Loading fee records...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const statusBadge = getFeeStatusBadge(inv.status);
                    const remaining = inv.amount - inv.paidAmount;

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{inv.student.user.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {inv.student.class?.name} - {inv.student.class?.section}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800 block">{inv.title}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            {inv.feeType}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(inv.amount)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                          {formatCurrency(inv.paidAmount)}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{formatDate(inv.dueDate)}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${statusBadge.color}`}
                          >
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {remaining > 0 ? (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsPayModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
                            >
                              Collect Fee
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Receipt Issued</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Generate Student Fee Invoice</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Student *</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.admissionNo}) - {s.className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Item Title *</label>
                <input
                  type="text"
                  required
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  placeholder="e.g. Science Lab & Computing Term Fee"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Category</label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    <option value="TUITION">TUITION</option>
                    <option value="LAB">LAB</option>
                    <option value="SPORTS">SPORTS</option>
                    <option value="LIBRARY">LIBRARY</option>
                    <option value="EXAM">EXAM</option>
                    <option value="TRANSPORT">TRANSPORT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
                >
                  {creating ? 'Generating...' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      <FeePaymentModal
        isOpen={isPayModalOpen}
        onClose={() => {
          setIsPayModalOpen(false);
          setSelectedInvoice(null);
        }}
        onSuccess={fetchFeesData}
        invoice={selectedInvoice}
      />
    </div>
  );
}
