import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';

    const where: any = {};

    if (department) {
      where.department = department;
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { employeeId: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        classes: true,
        subjects: {
          include: {
            class: true,
          },
        },
      },
      orderBy: {
        joiningDate: 'asc',
      },
    });

    const formatted = teachers.map((t) => ({
      id: t.id,
      userId: t.userId,
      name: t.user.name,
      email: t.user.email,
      avatar: t.user.avatar,
      employeeId: t.employeeId,
      phone: t.phone,
      department: t.department,
      designation: t.designation,
      qualification: t.qualification,
      joiningDate: t.joiningDate,
      classes: t.classes.map((c) => `${c.name} - ${c.section}`),
      subjects: t.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        class: `${s.class.name} - ${s.class.section}`,
      })),
    }));

    return NextResponse.json({ success: true, count: formatted.length, teachers: formatted });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      employeeId,
      phone,
      department,
      designation,
      qualification,
    } = body;

    if (!name || !email || !employeeId || !department) {
      return NextResponse.json(
        { error: 'Name, email, employee ID, and department are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const existingEmp = await prisma.teacher.findUnique({
      where: { employeeId: employeeId.trim() },
    });
    if (existingEmp) {
      return NextResponse.json({ error: 'Employee ID already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'TEACHER',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeId: employeeId.trim(),
        phone: phone || null,
        department: department.trim(),
        designation: designation || 'Faculty Member',
        qualification: qualification || 'Master of Science / Education',
        joiningDate: new Date(),
      },
      include: {
        user: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'TEACHER_APPOINTED',
        details: `Faculty member ${name} (${employeeId}) appointed to ${department} department.`,
        userName: 'Administrator',
        userRole: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, teacher }, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
  }
}
