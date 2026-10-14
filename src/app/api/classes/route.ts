import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        classTeacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        subjects: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            students: true,
            subjects: true,
          },
        },
      },
      orderBy: [
        { name: 'asc' },
        { section: 'asc' },
      ],
    });

    return NextResponse.json({ success: true, count: classes.length, classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, section, room, academicYear = '2026-2027', classTeacherId } = body;

    if (!name || !section) {
      return NextResponse.json({ error: 'Class name and section are required' }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        name: name.trim(),
        section: section.trim(),
        room: room ? room.trim() : null,
        academicYear,
        classTeacherId: classTeacherId || null,
      },
      include: {
        classTeacher: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ success: true, class: newClass }, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}
