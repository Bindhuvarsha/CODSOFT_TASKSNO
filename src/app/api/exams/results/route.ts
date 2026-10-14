import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateGrade } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('examId');
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    const where: any = {};
    if (examId) where.examId = examId;
    if (studentId) where.studentId = studentId;
    if (classId) where.exam = { classId };

    const results = await prisma.examResult.findMany({
      where,
      include: {
        exam: true,
        subject: true,
        student: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
            class: true,
          },
        },
      },
      orderBy: [
        { student: { rollNo: 'asc' } },
        { subject: { code: 'asc' } },
      ],
    });

    return NextResponse.json({ success: true, count: results.length, results });
  } catch (error) {
    console.error('Error fetching exam results:', error);
    return NextResponse.json({ error: 'Failed to fetch exam results' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { examId, subjectId, marksList } = body;

    // marksList: Array<{ studentId: string, marksObtained: number, maxMarks?: number, remarks?: string }>
    if (!examId || !subjectId || !marksList || !Array.isArray(marksList)) {
      return NextResponse.json(
        { error: 'Exam ID, subject ID, and marksList array are required' },
        { status: 400 }
      );
    }

    const saved = [];

    for (const item of marksList) {
      const maxMarks = item.maxMarks || 100;
      const { grade } = calculateGrade(Number(item.marksObtained), maxMarks);

      const res = await prisma.examResult.upsert({
        where: {
          examId_studentId_subjectId: {
            examId,
            studentId: item.studentId,
            subjectId,
          },
        },
        update: {
          marksObtained: Number(item.marksObtained),
          maxMarks,
          grade,
          remarks: item.remarks || null,
        },
        create: {
          examId,
          studentId: item.studentId,
          subjectId,
          marksObtained: Number(item.marksObtained),
          maxMarks,
          grade,
          remarks: item.remarks || null,
        },
      });
      saved.push(res);
    }

    await prisma.activityLog.create({
      data: {
        action: 'GRADES_SUBMITTED',
        details: `Entered marks for ${saved.length} students in Subject ${subjectId}`,
        userName: 'Teacher',
        userRole: 'TEACHER',
      },
    });

    return NextResponse.json({ success: true, count: saved.length, results: saved });
  } catch (error) {
    console.error('Error saving exam grades:', error);
    return NextResponse.json({ error: 'Failed to record grades' }, { status: 500 });
  }
}
