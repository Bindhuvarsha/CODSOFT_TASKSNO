import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        class: {
          include: {
            classTeacher: {
              include: {
                user: true,
              },
            },
            subjects: {
              include: {
                teacher: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        attendances: {
          orderBy: {
            date: 'desc',
          },
          take: 30,
        },
        examResults: {
          include: {
            exam: true,
            subject: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        fees: {
          orderBy: {
            dueDate: 'desc',
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      rollNo,
      gender,
      bloodGroup,
      phone,
      address,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianRelation,
      classId,
      status,
    } = body;

    const existingStudent = await prisma.student.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Update user if name or email changed
    if (name || email) {
      await prisma.user.update({
        where: { id: existingStudent.userId },
        data: {
          ...(name && { name: name.trim() }),
          ...(email && { email: email.toLowerCase().trim() }),
        },
      });
    }

    // Update student profile
    const updatedStudent = await prisma.student.update({
      where: { id: params.id },
      data: {
        ...(rollNo && { rollNo: String(rollNo) }),
        ...(gender && { gender }),
        ...(bloodGroup && { bloodGroup }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(guardianName && { guardianName }),
        ...(guardianPhone && { guardianPhone }),
        ...(guardianEmail !== undefined && { guardianEmail }),
        ...(guardianRelation && { guardianRelation }),
        ...(classId && { classId }),
        ...(status && { status }),
      },
      include: {
        user: true,
        class: true,
      },
    });

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Deleting user will cascade delete student, attendances, fees, examResults
    await prisma.user.delete({
      where: { id: student.userId },
    });

    return NextResponse.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
