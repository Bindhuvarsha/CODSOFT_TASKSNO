import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    const where: any = {};
    if (classId) {
      where.classId = classId;
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        class: {
          include: {
            subjects: true,
          },
        },
        _count: {
          select: {
            results: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json({ success: true, count: exams.length, exams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, examType, startDate, endDate, academicYear = '2026-2027', classId } = body;

    if (!title || !examType || !startDate || !endDate || !classId) {
      return NextResponse.json(
        { error: 'Title, exam type, start date, end date, and class are required' },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        title: title.trim(),
        examType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        academicYear,
        classId,
      },
      include: {
        class: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'EXAM_CREATED',
        details: `Scheduled ${title} for ${exam.class.name} - ${exam.class.section}`,
        userName: 'Administrator',
        userRole: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, exam }, { status: 201 });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}
