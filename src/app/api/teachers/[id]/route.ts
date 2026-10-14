import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        classes: {
          include: {
            students: true,
          },
        },
        subjects: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json({ error: 'Failed to fetch teacher' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, email, phone, department, designation, qualification } = body;

    const existing = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    if (name || email) {
      await prisma.user.update({
        where: { id: existing.userId },
        data: {
          ...(name && { name: name.trim() }),
          ...(email && { email: email.toLowerCase().trim() }),
        },
      });
    }

    const updated = await prisma.teacher.update({
      where: { id: params.id },
      data: {
        ...(phone !== undefined && { phone }),
        ...(department && { department: department.trim() }),
        ...(designation && { designation }),
        ...(qualification && { qualification }),
      },
      include: {
        user: true,
        classes: true,
        subjects: true,
      },
    });

    return NextResponse.json({ success: true, teacher: updated });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: teacher.userId },
    });

    return NextResponse.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}
