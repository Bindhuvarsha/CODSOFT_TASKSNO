import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        studentProfile: {
          include: {
            class: true,
          },
        },
        teacherProfile: {
          include: {
            classes: true,
            subjects: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'TEACHER' | 'STUDENT',
      avatar: user.avatar,
      studentId: user.studentProfile?.id || null,
      teacherId: user.teacherProfile?.id || null,
      classId: user.studentProfile?.classId || null,
    };

    const token = signToken(tokenPayload);

    let redirectPath = '/admin';
    if (user.role === 'TEACHER') redirectPath = '/teacher';
    if (user.role === 'STUDENT') redirectPath = '/student';

    const response = NextResponse.json({
      success: true,
      user: tokenPayload,
      redirect: redirectPath,
    });

    response.cookies.set('edumanage_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
