'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Landmark, QrCode, Banknote, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: any;
}

export default function FeePaymentModal({
  isOpen,
  onClose,
  onSuccess,
  invoice,
}: FeePaymentModalProps) {
  if (!isOpen || !invoice) return null;

  const remaining = invoice.amount - invoice.paidAmount;
  const [paymentAmount, setPaymentAmount] = useState<number>(remaining);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_CARD' | 'UPI' | 'BANK_TRANSFER' | 'CASH'>('ONLINE_CARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const txn = `TXN-EDM-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch('/api/fees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          paymentAmount: Number(paymentAmount),
          paymentMethod,
          transactionId: txn,
          remarks: `Payment processed successfully via ${paymentMethod}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Payment processing error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Process Fee Settlement</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Invoice: {invoice.invoiceNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePay} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Fee Title:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{invoice.title}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Total Bill:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Already Paid:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>Balance Outstanding:</span>
              <span className="text-rose-600 dark:text-rose-400">{formatCurrency(remaining)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Amount ($) *</label>
            <input
              type="number"
              step="0.01"
              min="1"
              max={remaining}
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
            />
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentAmount(remaining)}
                className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
              >
                Pay Full Balance ({formatCurrency(remaining)})
              </button>
              {remaining > 500 && (
                <button
                  type="button"
                  onClick={() => setPaymentAmount(Math.round(remaining / 2))}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:underline"
                >
                  Pay 50%
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE_CARD')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                  paymentMethod === 'ONLINE_CARD'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Credit/Debit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <QrCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Instant UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Bank Wire
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Cash at Bursar
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || paymentAmount <= 0}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirm {formatCurrency(paymentAmount)} Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
