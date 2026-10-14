import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const allRecords = await prisma.attendance.findMany({
      orderBy: { date: 'asc' },
    });

    const total = allRecords.length;
    const present = allRecords.filter((r) => r.status === 'PRESENT').length;
    const late = allRecords.filter((r) => r.status === 'LATE').length;
    const absent = allRecords.filter((r) => r.status === 'ABSENT').length;
    const excused = allRecords.filter((r) => r.status === 'EXCUSED').length;

    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    // Group by date for chart trend
    const dateMap: { [key: string]: { date: string; present: number; absent: number; late: number; excused: number; rate: number } } = {};

    allRecords.forEach((r) => {
      const d = r.date.toISOString().split('T')[0];
      if (!dateMap[d]) {
        dateMap[d] = { date: d, present: 0, absent: 0, late: 0, excused: 0, rate: 0 };
      }
      if (r.status === 'PRESENT') dateMap[d].present++;
      else if (r.status === 'LATE') dateMap[d].late++;
      else if (r.status === 'ABSENT') dateMap[d].absent++;
      else if (r.status === 'EXCUSED') dateMap[d].excused++;
    });

    const trend = Object.values(dateMap).map((d) => {
      const dayTotal = d.present + d.late + d.absent + d.excused;
      const dayRate = dayTotal > 0 ? Math.round(((d.present + d.late) / dayTotal) * 100) : 0;
      return {
        ...d,
        rate: dayRate,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        total,
        present,
        late,
        absent,
        excused,
        rate,
      },
      trend: trend.slice(-14), // Last 14 days
    });
  } catch (error) {
    console.error('Error calculating attendance stats:', error);
    return NextResponse.json({ error: 'Failed to compute attendance stats' }, { status: 500 });
  }
}
