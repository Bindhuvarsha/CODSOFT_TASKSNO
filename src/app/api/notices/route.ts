import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const category = searchParams.get('category');

    const where: any = {};

    if (role && role !== 'ADMIN') {
      where.OR = [
        { targetRole: 'ALL' },
        { targetRole: role },
      ];
    }

    if (category) {
      where.category = category;
    }

    const notices = await prisma.notice.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            role: true,
            avatar: true,
          },
        },
      },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, count: notices.length, notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = getSessionFromCookies();
    const body = await req.json();
    const { title, content, category = 'GENERAL', targetRole = 'ALL', pinned = false, authorId } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const effectiveAuthorId = authorId || session?.id;

    if (!effectiveAuthorId) {
      // Find default admin author
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!admin) return NextResponse.json({ error: 'Author required' }, { status: 400 });

      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          category,
          targetRole,
          pinned: Boolean(pinned),
          authorId: admin.id,
        },
        include: { author: true },
      });
      return NextResponse.json({ success: true, notice }, { status: 201 });
    }

    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category,
        targetRole,
        pinned: Boolean(pinned),
        authorId: effectiveAuthorId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json({ success: true, notice }, { status: 201 });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}
