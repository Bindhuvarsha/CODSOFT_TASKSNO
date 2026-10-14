import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const dateStr = searchParams.get('date');
    const studentId = searchParams.get('studentId');

    const where: any = {};

    if (classId) {
      where.classId = classId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (dateStr) {
      const parsedDate = new Date(dateStr);
      const startOfDay = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
      const endOfDay = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 23, 59, 59));
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                email: true,
              },
            },
          },
        },
        class: true,
        markedBy: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ success: true, count: attendances.length, attendances });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { classId, date, records, markedById } = body;

    // records: Array<{ studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED', remarks?: string }>
    if (!classId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: 'Class ID, date, and attendance records array are required' },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    const normalizedDate = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));

    const results = [];

    for (const item of records) {
      const attendance = await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: item.studentId,
            date: normalizedDate,
          },
        },
        update: {
          status: item.status,
          remarks: item.remarks || null,
          markedById: markedById || null,
        },
        create: {
          studentId: item.studentId,
          classId,
          date: normalizedDate,
          status: item.status,
          remarks: item.remarks || null,
          markedById: markedById || null,
        },
      });
      results.push(attendance);
    }

    await prisma.activityLog.create({
      data: {
        action: 'ATTENDANCE_RECORDED',
        details: `Recorded attendance for ${records.length} students on ${normalizedDate.toISOString().split('T')[0]}`,
        userName: markedById ? 'Teacher' : 'Administrator',
        userRole: markedById ? 'TEACHER' : 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, count: results.length, records: results });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}
