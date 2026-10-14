import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const invoices = await prisma.feeInvoice.findMany();

    const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pendingDues = totalBilled - totalCollected;

    const paidCount = invoices.filter((inv) => inv.status === 'PAID').length;
    const partialCount = invoices.filter((inv) => inv.status === 'PARTIAL').length;
    const pendingCount = invoices.filter((inv) => inv.status === 'PENDING').length;
    const overdueCount = invoices.filter((inv) => inv.status === 'OVERDUE').length;

    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

    // Breakdown by type
    const breakdownMap: { [key: string]: { type: string; total: number; collected: number } } = {};
    invoices.forEach((inv) => {
      if (!breakdownMap[inv.feeType]) {
        breakdownMap[inv.feeType] = { type: inv.feeType, total: 0, collected: 0 };
      }
      breakdownMap[inv.feeType].total += inv.amount;
      breakdownMap[inv.feeType].collected += inv.paidAmount;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalBilled,
        totalCollected,
        pendingDues,
        collectionRate,
        counts: {
          total: invoices.length,
          paid: paidCount,
          partial: partialCount,
          pending: pendingCount,
          overdue: overdueCount,
        },
        breakdown: Object.values(breakdownMap),
      },
    });
  } catch (error) {
    console.error('Error fetching fee statistics:', error);
    return NextResponse.json({ error: 'Failed to compute fee statistics' }, { status: 500 });
  }
}
