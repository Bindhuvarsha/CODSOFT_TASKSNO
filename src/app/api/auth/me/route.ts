import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
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
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      student: user.studentProfile,
      teacher: user.teacherProfile,
    },
  });
}
