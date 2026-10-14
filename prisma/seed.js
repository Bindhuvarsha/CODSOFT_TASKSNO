const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting EduManage Database Seeding...');

  // Clean existing records in reverse dependency order
  await prisma.activityLog.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.examResult.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.student.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@edumanage.com',
      name: 'Dr. Eleanor Vance',
      password: hashedPassword,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 2. Create Teacher Users & Profiles
  const teacher1User = await prisma.user.create({
    data: {
      email: 'sarah.jenkins@edumanage.com',
      name: 'Prof. Sarah Jenkins',
      password: hashedPassword,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher1 = await prisma.teacher.create({
    data: {
      userId: teacher1User.id,
      employeeId: 'EMP-T101',
      phone: '+1 (555) 234-5678',
      department: 'Mathematics & Computing',
      designation: 'Senior Faculty & Dept Head',
      qualification: 'Ph.D. in Applied Mathematics',
      joiningDate: new Date('2021-08-15'),
    },
  });

  const teacher2User = await prisma.user.create({
    data: {
      email: 'robert.chen@edumanage.com',
      name: 'Dr. Robert Chen',
      password: hashedPassword,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      userId: teacher2User.id,
      employeeId: 'EMP-T102',
      phone: '+1 (555) 345-6789',
      department: 'Physical Sciences',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Physics, M.Ed',
      joiningDate: new Date('2022-01-10'),
    },
  });

  const teacher3User = await prisma.user.create({
    data: {
      email: 'amanda.hayes@edumanage.com',
      name: 'Ms. Amanda Hayes',
      password: hashedPassword,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher3 = await prisma.teacher.create({
    data: {
      userId: teacher3User.id,
      employeeId: 'EMP-T103',
      phone: '+1 (555) 456-7890',
      department: 'Humanities & Literature',
      designation: 'Lead English Instructor',
      qualification: 'M.A. in English Literature, Cambridge CELTA',
      joiningDate: new Date('2023-03-01'),
    },
  });

  // 3. Create Classes
  const class10A = await prisma.class.create({
    data: {
      name: 'Grade 10',
      section: 'A',
      room: 'Hall 101 - North Wing',
      academicYear: '2026-2027',
      classTeacherId: teacher1.id,
    },
  });

  const class10B = await prisma.class.create({
    data: {
      name: 'Grade 10',
      section: 'B',
      room: 'Hall 102 - North Wing',
      academicYear: '2026-2027',
      classTeacherId: teacher2.id,
    },
  });

  const class11Sci = await prisma.class.create({
    data: {
      name: 'Grade 11',
      section: 'Science',
      room: 'Lab Complex 201',
      academicYear: '2026-2027',
      classTeacherId: teacher2.id,
    },
  });

  const class12Tech = await prisma.class.create({
    data: {
      name: 'Grade 12',
      section: 'Tech',
      room: 'Tech Hub 305',
      academicYear: '2026-2027',
      classTeacherId: teacher3.id,
    },
  });

  // 4. Create Subjects
  const subMath10 = await prisma.subject.create({
    data: {
      name: 'Advanced Mathematics',
      code: 'MATH-101',
      classId: class10A.id,
      teacherId: teacher1.id,
    },
  });

  const subPhys10 = await prisma.subject.create({
    data: {
      name: 'Physics & Mechanics',
      code: 'PHYS-101',
      classId: class10A.id,
      teacherId: teacher2.id,
    },
  });

  const subEng10 = await prisma.subject.create({
    data: {
      name: 'English Language & Composition',
      code: 'ENG-101',
      classId: class10A.id,
      teacherId: teacher3.id,
    },
  });

  const subCs10 = await prisma.subject.create({
    data: {
      name: 'Computer Science & Algorithms',
      code: 'CS-101',
      classId: class10A.id,
      teacherId: teacher1.id,
    },
  });

  // Subjects for other classes
  await prisma.subject.create({
    data: {
      name: 'Mathematics Fundamentals',
      code: 'MATH-102',
      classId: class10B.id,
      teacherId: teacher1.id,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Advanced Quantum Physics',
      code: 'PHYS-201',
      classId: class11Sci.id,
      teacherId: teacher2.id,
    },
  });

  await prisma.subject.create({
    data: {
      name: 'Software Systems Architecture',
      code: 'CS-301',
      classId: class12Tech.id,
      teacherId: teacher1.id,
    },
  });

  // 5. Create Students
  // Demo Student 1: Alex Rivera
  const studentUser1 = await prisma.user.create({
    data: {
      email: 'student@edumanage.com',
      name: 'Alex Rivera',
      password: hashedPassword,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
  });

  const student1 = await prisma.student.create({
    data: {
      userId: studentUser1.id,
      admissionNo: 'ADM-2026-001',
      rollNo: '101',
      gender: 'Male',
      dateOfBirth: new Date('2009-04-12'),
      bloodGroup: 'O+',
      phone: '+1 (555) 789-0123',
      address: '742 Evergreen Terrace, Springfield, CA',
      guardianName: 'Carlos Rivera',
      guardianPhone: '+1 (555) 890-1234',
      guardianEmail: 'carlos.rivera@example.com',
      guardianRelation: 'Father',
      status: 'ACTIVE',
      enrollmentDate: new Date('2024-09-01'),
      classId: class10A.id,
    },
  });

  // Other students
  const additionalStudentsData = [
    {
      name: 'Sophia Martinez',
      email: 'sophia.martinez@edumanage.com',
      admissionNo: 'ADM-2026-002',
      rollNo: '102',
      gender: 'Female',
      dob: '2009-06-25',
      blood: 'A+',
      guardian: 'Elena Martinez',
      gRelation: 'Mother',
      gPhone: '+1 (555) 901-2345',
      classId: class10A.id,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Liam Johnson',
      email: 'liam.johnson@edumanage.com',
      admissionNo: 'ADM-2026-003',
      rollNo: '103',
      gender: 'Male',
      dob: '2009-01-15',
      blood: 'B+',
      guardian: 'Marcus Johnson',
      gRelation: 'Father',
      gPhone: '+1 (555) 012-3456',
      classId: class10A.id,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Emma Watson',
      email: 'emma.watson@edumanage.com',
      admissionNo: 'ADM-2026-004',
      rollNo: '104',
      gender: 'Female',
      dob: '2009-09-30',
      blood: 'AB+',
      guardian: 'David Watson',
      gRelation: 'Father',
      gPhone: '+1 (555) 123-4567',
      classId: class10A.id,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Noah Patel',
      email: 'noah.patel@edumanage.com',
      admissionNo: 'ADM-2026-005',
      rollNo: '105',
      gender: 'Male',
      dob: '2009-11-08',
      blood: 'O-',
      guardian: 'Sanjay Patel',
      gRelation: 'Father',
      gPhone: '+1 (555) 234-5679',
      classId: class10A.id,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Olivia Brown',
      email: 'olivia.brown@edumanage.com',
      admissionNo: 'ADM-2026-006',
      rollNo: '201',
      gender: 'Female',
      dob: '2009-03-19',
      blood: 'A-',
      guardian: 'Jessica Brown',
      gRelation: 'Mother',
      gPhone: '+1 (555) 345-6780',
      classId: class10B.id,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ethan Davis',
      email: 'ethan.davis@edumanage.com',
      admissionNo: 'ADM-2026-007',
      rollNo: '202',
      gender: 'Male',
      dob: '2009-07-22',
      blood: 'B-',
      guardian: 'Arthur Davis',
      gRelation: 'Father',
      gPhone: '+1 (555) 456-7891',
      classId: class10B.id,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Mia Wilson',
      email: 'mia.wilson@edumanage.com',
      admissionNo: 'ADM-2026-008',
      rollNo: '301',
      gender: 'Female',
      dob: '2008-05-14',
      blood: 'O+',
      guardian: 'Rachel Wilson',
      gRelation: 'Mother',
      gPhone: '+1 (555) 567-8902',
      classId: class11Sci.id,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Lucas Garcia',
      email: 'lucas.garcia@edumanage.com',
      admissionNo: 'ADM-2026-009',
      rollNo: '302',
      gender: 'Male',
      dob: '2008-12-03',
      blood: 'AB-',
      guardian: 'Mateo Garcia',
      gRelation: 'Father',
      gPhone: '+1 (555) 678-9013',
      classId: class11Sci.id,
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ava Taylor',
      email: 'ava.taylor@edumanage.com',
      admissionNo: 'ADM-2026-010',
      rollNo: '401',
      gender: 'Female',
      dob: '2007-08-17',
      blood: 'A+',
      guardian: 'Christopher Taylor',
      gRelation: 'Father',
      gPhone: '+1 (555) 789-0124',
      classId: class12Tech.id,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const createdStudents = [student1];

  for (const s of additionalStudentsData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        name: s.name,
        password: hashedPassword,
        role: 'STUDENT',
        avatar: s.avatar,
      },
    });

    const stud = await prisma.student.create({
      data: {
        userId: user.id,
        admissionNo: s.admissionNo,
        rollNo: s.rollNo,
        gender: s.gender,
        dateOfBirth: new Date(s.dob),
        bloodGroup: s.blood,
        phone: '+1 (555) 888-' + s.rollNo,
        address: '100 University Avenue, Cityville',
        guardianName: s.guardian,
        guardianPhone: s.gPhone,
        guardianEmail: s.email.replace('@', '.guardian@'),
        guardianRelation: s.gRelation,
        status: 'ACTIVE',
        enrollmentDate: new Date('2024-09-01'),
        classId: s.classId,
      },
    });
    createdStudents.push(stud);
  }

  // 6. Create Attendance for the past 14 days
  const today = new Date();
  const class10AStudents = createdStudents.filter((s) => s.classId === class10A.id);

  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Skip weekends (0 is Sunday, 6 is Saturday)
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    // Normalise to midnight
    const dateKey = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

    for (const stud of class10AStudents) {
      // Create realistic attendance distribution: 85% Present, 8% Late, 5% Absent, 2% Excused
      let status = 'PRESENT';
      let remarks = null;
      const rand = Math.random();

      if (stud.id === student1.id) {
        // High attendance for demo student
        if (i === 3) {
          status = 'LATE';
          remarks = 'Traffic delay at transit bridge';
        } else if (i === 9) {
          status = 'EXCUSED';
          remarks = 'Dental appointment (note provided)';
        } else {
          status = 'PRESENT';
        }
      } else {
        if (rand < 0.82) {
          status = 'PRESENT';
        } else if (rand < 0.90) {
          status = 'LATE';
          remarks = 'Late bus arrival';
        } else if (rand < 0.96) {
          status = 'ABSENT';
          remarks = 'Unexcused absence';
        } else {
          status = 'EXCUSED';
          remarks = 'Medical leave';
        }
      }

      await prisma.attendance.create({
        data: {
          date: dateKey,
          status,
          remarks,
          studentId: stud.id,
          classId: class10A.id,
          markedById: teacher1.id,
        },
      });
    }
  }

  // 7. Create Examinations
  const midtermExam = await prisma.exam.create({
    data: {
      title: 'Midterm Examination 2026',
      examType: 'MIDTERM',
      startDate: new Date('2026-03-10'),
      endDate: new Date('2026-03-20'),
      academicYear: '2026-2027',
      classId: class10A.id,
    },
  });

  const unitTestExam = await prisma.exam.create({
    data: {
      title: 'Unit Assessment 1 (STEM Focus)',
      examType: 'UNIT_TEST',
      startDate: new Date('2026-02-05'),
      endDate: new Date('2026-02-08'),
      academicYear: '2026-2027',
      classId: class10A.id,
    },
  });

  // 8. Create Exam Results for Grade 10-A students
  const subjects10A = [subMath10, subPhys10, subEng10, subCs10];

  function getGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'F';
  }

  // Midterm scores
  const scoreMap = {
    [student1.id]: [94, 88, 92, 98], // Alex Rivera's scores
    [createdStudents[1].id]: [85, 90, 89, 91],
    [createdStudents[2].id]: [78, 82, 85, 80],
    [createdStudents[3].id]: [92, 95, 96, 94],
    [createdStudents[4].id]: [71, 68, 75, 82],
  };

  for (const stud of class10AStudents) {
    const scores = scoreMap[stud.id] || [80, 80, 80, 80];
    for (let sIdx = 0; sIdx < subjects10A.length; sIdx++) {
      const sub = subjects10A[sIdx];
      const marks = scores[sIdx];
      await prisma.examResult.create({
        data: {
          examId: midtermExam.id,
          studentId: stud.id,
          subjectId: sub.id,
          marksObtained: marks,
          maxMarks: 100,
          grade: getGrade(marks),
          remarks: marks >= 90 ? 'Outstanding academic achievement' : 'Good conceptual grasp and consistent effort',
        },
      });
    }
  }

  // 9. Create Fee Invoices
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-001',
      studentId: student1.id,
      title: 'First Term Academic Tuition Fee',
      feeType: 'TUITION',
      amount: 1450.0,
      paidAmount: 1450.0,
      dueDate: new Date('2026-01-15'),
      paidDate: new Date('2026-01-10'),
      status: 'PAID',
      paymentMethod: 'ONLINE_CARD',
      transactionId: 'TXN-EDM-994821',
      remarks: 'Payment settled in full via Visa debit.',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-002',
      studentId: student1.id,
      title: 'Advanced Computer & Science Lab Fee',
      feeType: 'LAB',
      amount: 350.0,
      paidAmount: 350.0,
      dueDate: new Date('2026-02-01'),
      paidDate: new Date('2026-01-28'),
      status: 'PAID',
      paymentMethod: 'UPI',
      transactionId: 'TXN-UPI-884201',
      remarks: 'Annual lab maintenance & equipment access.',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-003',
      studentId: student1.id,
      title: 'Second Term Academic Tuition Fee',
      feeType: 'TUITION',
      amount: 1450.0,
      paidAmount: 700.0,
      dueDate: new Date('2026-05-15'),
      status: 'PARTIAL',
      paymentMethod: 'BANK_TRANSFER',
      transactionId: 'TXN-BNK-110482',
      remarks: 'Installment 1 paid ($700). Remaining balance $750 due in May.',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-004',
      studentId: student1.id,
      title: 'Annual Sports & Extracurricular Amenities',
      feeType: 'SPORTS',
      amount: 180.0,
      paidAmount: 0.0,
      dueDate: new Date('2026-04-30'),
      status: 'PENDING',
      remarks: 'Covers swimming complex, gymnasium, and inter-school tournaments.',
    },
  });

  // Additional fee invoices for institutional analytics
  for (let idx = 1; idx < createdStudents.length; idx++) {
    const s = createdStudents[idx];
    const isPaid = idx % 2 === 0;
    await prisma.feeInvoice.create({
      data: {
        invoiceNumber: `INV-2026-10${idx}`,
        studentId: s.id,
        title: 'First Term Academic Tuition Fee',
        feeType: 'TUITION',
        amount: 1450.0,
        paidAmount: isPaid ? 1450.0 : 0.0,
        dueDate: new Date('2026-01-15'),
        paidDate: isPaid ? new Date('2026-01-12') : null,
        status: isPaid ? 'PAID' : (idx === 3 ? 'OVERDUE' : 'PENDING'),
        paymentMethod: isPaid ? 'ONLINE_CARD' : null,
        transactionId: isPaid ? `TXN-EDM-${990000 + idx}` : null,
        remarks: isPaid ? 'Settled on schedule.' : 'Awaiting payment confirmation.',
      },
    });
  }

  // 10. Create Announcements & Notices
  await prisma.notice.create({
    data: {
      title: 'Official Schedule: Midterm Examinations 2026',
      content: 'The Spring 2026 Midterm Examinations will commence from March 10th. All students must report to their assigned examination halls 15 minutes before the scheduled start time. Hall tickets will be issued digitally through your student portal.',
      category: 'EXAM',
      targetRole: 'ALL',
      authorId: adminUser.id,
      pinned: true,
      createdAt: new Date('2026-02-15'),
    },
  });

  await prisma.notice.create({
    data: {
      title: 'Annual Science & Innovation Expo 2026',
      content: 'EduManage proudly announces our Annual Innovation & STEM Exhibition. Interested students across Grades 9-12 can submit project abstracts to Dr. Robert Chen before February 28th. Cash prizes and regional exhibition sponsorships await winning teams.',
      category: 'ACADEMIC',
      targetRole: 'ALL',
      authorId: teacher2User.id,
      pinned: true,
      createdAt: new Date('2026-02-18'),
    },
  });

  await prisma.notice.create({
    data: {
      title: 'Teacher Faculty Development & Curriculum Review Session',
      content: 'A mandatory faculty development workshop will be held in the Conference Hall on Saturday at 10:00 AM. We will review digital assessment strategies and grading rubrics for the upcoming quarter.',
      category: 'GENERAL',
      targetRole: 'TEACHER',
      authorId: adminUser.id,
      pinned: false,
      createdAt: new Date('2026-02-20'),
    },
  });

  await prisma.notice.create({
    data: {
      title: 'Term 2 Fee Installment Due Date Reminder',
      content: 'Guardians and students are kindly reminded that the second installment for Term 2 tuition is due by May 15th. Avoid late administrative fees by settling dues online through the fee portal.',
      category: 'URGENT',
      targetRole: 'STUDENT',
      authorId: adminUser.id,
      pinned: false,
      createdAt: new Date('2026-02-22'),
    },
  });

  // 11. Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        action: 'SYSTEM_INITIALIZATION',
        details: 'EduManage platform v1.0 initialized with administrative credentials and academic schedules.',
        userName: 'Dr. Eleanor Vance',
        userRole: 'ADMIN',
        createdAt: new Date('2026-01-05'),
      },
      {
        action: 'STUDENT_ENROLLMENT',
        details: 'Enrolled 10 students across Grade 10-A, 10-B, Grade 11 Science, and Grade 12 Tech.',
        userName: 'Dr. Eleanor Vance',
        userRole: 'ADMIN',
        createdAt: new Date('2026-01-10'),
      },
      {
        action: 'ATTENDANCE_RECORDED',
        details: 'Daily attendance session recorded for Grade 10 - Section A (28 active students).',
        userName: 'Prof. Sarah Jenkins',
        userRole: 'TEACHER',
        createdAt: new Date('2026-02-14'),
      },
      {
        action: 'EXAM_SCHEDULED',
        details: 'Published Midterm Examination 2026 timetable and subject syllabus guidelines.',
        userName: 'Dr. Eleanor Vance',
        userRole: 'ADMIN',
        createdAt: new Date('2026-02-15'),
      },
      {
        action: 'GRADES_SUBMITTED',
        details: 'Grades entered for Grade 10-A Midterm Mathematics (MATH-101).',
        userName: 'Prof. Sarah Jenkins',
        userRole: 'TEACHER',
        createdAt: new Date('2026-02-20'),
      },
    ],
  });

  console.log('✅ EduManage Database Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
