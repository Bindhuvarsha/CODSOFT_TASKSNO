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
      recentAdmissions,
      upcomingExams,
      notices,
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
      prisma.student.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
          class: {
            select: {
              name: true,
              section: true,
            },
          },
        },
      }),
      prisma.exam.findMany({
        orderBy: { startDate: 'asc' },
        take: 3,
        include: {
          class: {
            select: {
              name: true,
              section: true,
            },
          },
        },
      }),
      prisma.notice.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
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

    const upcomingEvents = [
      ...upcomingExams.map((exam) => ({
        id: `exam-${exam.id}`,
        title: exam.title,
        subtitle: `${exam.class?.name || 'Class'} (${exam.class?.section || 'A'})`,
        date: exam.startDate,
        category: 'EXAM',
        type: exam.examType,
      })),
      ...notices.map((n) => ({
        id: `notice-${n.id}`,
        title: n.title,
        subtitle: n.category,
        date: n.createdAt,
        category: n.category,
        type: 'EVENT',
      })),
    ].slice(0, 5);

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
      recentAdmissions,
      upcomingEvents,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to compute dashboard stats' }, { status: 500 });
  }
}
