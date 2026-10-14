'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FeePaymentModal from '@/components/FeePaymentModal';
import {
  CreditCard,
  DollarSign,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Download,
} from 'lucide-react';
import { formatCurrency, formatDate, getFeeStatusBadge } from '@/lib/utils';

export default function StudentFeesPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const fetchStudentData = async () => {
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
      console.error('Failed to load fees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fees = student?.fees || [];
  const totalBilled = fees.reduce((sum: number, f: any) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum: number, f: any) => sum + f.paidAmount, 0);
  const pendingDues = totalBilled - totalPaid;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Tuition Invoices & Payment Portal"
        subtitle="Manage academic fee installments, make digital payments, and download receipts"
        role="STUDENT"
        userName="Alex Rivera"
      />

      <div className="p-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Billed Fees</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalBilled)}</p>
            <span className="text-[10px] text-slate-400">Academic Year 2026-2027</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Settled Payments</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalPaid)}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Verified receipts available</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Outstanding Balance</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(pendingDues)}</p>
            <span className="text-[10px] text-slate-400">Next installment due May 15</span>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Academic Fee Statements</h3>
              <p className="text-xs text-slate-500">Student: {student?.user?.name} ({student?.admissionNo})</p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">{fees.length} Total Invoices</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Particulars</th>
                  <th className="py-3 px-3 text-right">Total Bill</th>
                  <th className="py-3 px-3 text-right">Paid to Date</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      Loading fee statements...
                    </td>
                  </tr>
                ) : fees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      No fee records found.
                    </td>
                  </tr>
                ) : (
                  fees.map((inv: any) => {
                    const badge = getFeeStatusBadge(inv.status);
                    const remaining = inv.amount - inv.paidAmount;

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{inv.title}</p>
                          <p className="text-[11px] text-slate-400">
                            {inv.feeType} • {inv.remarks || 'Standard academic fee installment'}
                          </p>
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
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {remaining > 0 ? (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsPayModalOpen(true);
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                            >
                              Pay {formatCurrency(remaining)}
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Paid Full
                            </span>
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

      <FeePaymentModal
        isOpen={isPayModalOpen}
        onClose={() => {
          setIsPayModalOpen(false);
          setSelectedInvoice(null);
        }}
        onSuccess={fetchStudentData}
        invoice={selectedInvoice}
      />
    </div>
  );
}
