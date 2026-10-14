import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');
    const feeType = searchParams.get('feeType');
    const search = searchParams.get('search');

    const where: any = {};

    if (status) where.status = status;
    if (studentId) where.studentId = studentId;
    if (feeType) where.feeType = feeType;

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { title: { contains: search } },
        { student: { user: { name: { contains: search } } } },
        { student: { admissionNo: { contains: search } } },
      ];
    }

    const invoices = await prisma.feeInvoice.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatar: true,
              },
            },
            class: true,
          },
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    return NextResponse.json({ success: true, count: invoices.length, invoices });
  } catch (error) {
    console.error('Error fetching fee invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch fee invoices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, title, feeType = 'TUITION', amount, dueDate, remarks } = body;

    if (!studentId || !title || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'Student ID, title, amount, and due date are required' },
        { status: 400 }
      );
    }

    const count = await prisma.feeInvoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 101).padStart(4, '0')}`;

    const invoice = await prisma.feeInvoice.create({
      data: {
        invoiceNumber,
        studentId,
        title: title.trim(),
        feeType,
        amount: Number(amount),
        paidAmount: 0,
        dueDate: new Date(dueDate),
        status: 'PENDING',
        remarks: remarks || null,
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'INVOICE_GENERATED',
        details: `Generated invoice ${invoiceNumber} for $${amount} (${title})`,
        userName: 'Administrator',
        userRole: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error) {
    console.error('Error generating fee invoice:', error);
    return NextResponse.json({ error: 'Failed to generate fee invoice' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { invoiceId, paymentAmount, paymentMethod = 'ONLINE_CARD', transactionId, remarks } = body;

    if (!invoiceId || !paymentAmount) {
      return NextResponse.json(
        { error: 'Invoice ID and payment amount are required' },
        { status: 400 }
      );
    }

    const invoice = await prisma.feeInvoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const newPaidAmount = invoice.paidAmount + Number(paymentAmount);
    let newStatus = 'PARTIAL';
    if (newPaidAmount >= invoice.amount) {
      newStatus = 'PAID';
    }

    const txn = transactionId || `TXN-EDM-${Math.floor(100000 + Math.random() * 900000)}`;

    const updated = await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: Math.min(newPaidAmount, invoice.amount),
        status: newStatus,
        paymentMethod,
        transactionId: txn,
        paidDate: new Date(),
        remarks: remarks ? `${invoice.remarks ? invoice.remarks + ' | ' : ''}${remarks}` : invoice.remarks,
      },
      include: {
        student: {
          include: { user: true, class: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'PAYMENT_RECORDED',
        details: `Received payment of $${paymentAmount} for invoice ${updated.invoiceNumber} via ${paymentMethod} (${txn})`,
        userName: 'Accounts Desk',
        userRole: 'FINANCE',
      },
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error) {
    console.error('Error recording fee payment:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}
