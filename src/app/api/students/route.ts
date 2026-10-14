import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};

    if (classId) {
      where.classId = classId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { admissionNo: { contains: search } },
        { rollNo: { contains: search } },
      ];
    }

    const students = await prisma.student.findMany({
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
        class: true,
        attendances: {
          select: {
            status: true,
          },
        },
        fees: {
          select: {
            amount: true,
            paidAmount: true,
            status: true,
          },
        },
      },
      orderBy: {
        rollNo: 'asc',
      },
    });

    // Compute metrics per student
    const formatted = students.map((s) => {
      const totalAtt = s.attendances.length;
      const presentCount = s.attendances.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
      const attendanceRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;

      const totalFees = s.fees.reduce((sum, f) => sum + f.amount, 0);
      const paidFees = s.fees.reduce((sum, f) => sum + f.paidAmount, 0);
      const pendingFees = totalFees - paidFees;

      return {
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        email: s.user.email,
        avatar: s.user.avatar,
        admissionNo: s.admissionNo,
        rollNo: s.rollNo,
        gender: s.gender,
        dateOfBirth: s.dateOfBirth,
        bloodGroup: s.bloodGroup,
        phone: s.phone,
        address: s.address,
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        guardianEmail: s.guardianEmail,
        guardianRelation: s.guardianRelation,
        status: s.status,
        enrollmentDate: s.enrollmentDate,
        classId: s.classId,
        className: `${s.class.name} - ${s.class.section}`,
        classDetails: s.class,
        attendanceRate,
        totalFees,
        paidFees,
        pendingFees,
      };
    });

    return NextResponse.json({ success: true, count: formatted.length, students: formatted });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      admissionNo,
      rollNo,
      gender,
      dateOfBirth,
      bloodGroup,
      phone,
      address,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianRelation,
      classId,
      status = 'ACTIVE',
    } = body;

    if (!name || !email || !admissionNo || !classId) {
      return NextResponse.json(
        { error: 'Name, email, admission number, and class are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Check admissionNo
    const existingAdm = await prisma.student.findUnique({
      where: { admissionNo: admissionNo.trim() },
    });
    if (existingAdm) {
      return NextResponse.json({ error: 'Admission number already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'STUDENT',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        admissionNo: admissionNo.trim(),
        rollNo: rollNo ? String(rollNo) : '1',
        gender: gender || 'Male',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('2009-01-01'),
        bloodGroup: bloodGroup || 'O+',
        phone: phone || null,
        address: address || null,
        guardianName: guardianName || 'Parent / Guardian',
        guardianPhone: guardianPhone || '+1 (555) 000-0000',
        guardianEmail: guardianEmail || null,
        guardianRelation: guardianRelation || 'Guardian',
        classId,
        status,
        enrollmentDate: new Date(),
      },
      include: {
        user: true,
        class: true,
      },
    });

    // Record audit log
    await prisma.activityLog.create({
      data: {
        action: 'STUDENT_ENROLLED',
        details: `New student ${name} (${admissionNo}) enrolled in ${student.class.name} - ${student.class.section}`,
        userName: 'Administrator',
        userRole: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, student }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
