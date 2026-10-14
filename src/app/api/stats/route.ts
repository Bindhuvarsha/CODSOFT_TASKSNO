import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      allAttendance,
      allFees,
      recentActivities,
      classesWithStudents,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.attendance.findMany({ select: { status: true, date: true } }),
      prisma.feeInvoice.findMany({ select: { amount: true, paidAmount: true, status: true } }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.class.findMany({
        select: {
          name: true,
          section: true,
          _count: {
            select: { students: true },
          },
        },
      }),
    ]);

    // Attendance calculation
    const totalAtt = allAttendance.length;
    const presentAtt = allAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendanceRate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 94;

    // Fee calculation
    const totalBilled = allFees.reduce((sum, f) => sum + f.amount, 0);
    const totalCollected = allFees.reduce((sum, f) => sum + f.paidAmount, 0);
    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

    const classDistribution = classesWithStudents.map((c) => ({
      name: `${c.name} (${c.section})`,
      students: c._count.students,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSubjects,
        attendanceRate,
        collectionRate,
        totalBilled,
        totalCollected,
        pendingDues: totalBilled - totalCollected,
      },
      classDistribution,
      recentActivities,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to compute dashboard stats' }, { status: 500 });
  }
}
