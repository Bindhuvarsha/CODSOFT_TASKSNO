# EduManage — Student Management System (CODSOFT Task 1)

EduManage is a modern, full-stack education management platform engineered to digitize institutional academic and administrative workflows. Built with **Next.js 14**, **Node.js**, **Prisma ORM**, and supporting both **PostgreSQL** (production) and **SQLite** (zero-config local development).

Manual, paper-based records make it challenging for educational institutions to maintain accurate student data, track attendance, manage exam grades, and handle fee collections. EduManage replaces these legacy processes with centralized role-based portals for **Students**, **Teachers**, and **Administrators**.

---

## 🌟 Key Highlights & Modules

### 1. Role-Based Access Control (RBAC) & Portals
- **Administrator Portal**: Complete institutional governance—manage student enrollments, faculty appointments, classes and curriculum, fee invoicing, revenue analytics, and system audit logs.
- **Teacher Portal**: Class roll call attendance, gradebook & examination score entry with automatic GPA calculation, and student roster mentorship.
- **Student & Guardian Portal**: Academic report card transcripts, day-by-day attendance tracking, fee invoice payment simulation, and school notices.
- **1-Click Demo Switcher**: Seamlessly switch between Admin, Teacher, and Student roles with pre-configured credentials directly from any page.

### 2. Core Functional Modules
- **Student Information System (SIS)**: Full CRUD, roll numbers, admission codes, guardian details, blood group, contact records, and CSV export.
- **Faculty Directory**: Academic departments, designations, qualifications, and class in-charge assignments.
- **Class & Course Management**: Grade cohorts, section capacities, room locations, and subject syllabus mapping.
- **Attendance Intelligence**: Real-time daily register marking (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`), percentage calculations, and historical charts.
- **Examinations & Grading**: Assessment schedules, marks entry, automatic letter grading (A+ to F), and printable official report card transcripts with institutional letterhead and signatures.
- **Fee Management & Invoicing**: Itemized fee bills (Tuition, Lab, Sports, Library), payment tracking (`PAID`, `PARTIAL`, `PENDING`, `OVERDUE`), online payment simulator (Card, UPI, Bank Transfer), and receipts.
- **Noticeboard & Circulars**: Broadcast system announcements with targeted recipient filters (`ALL`, `TEACHER`, `STUDENT`) and pinned notices.
- **Audit Trail & Activity Log**: Track institutional events (enrollments, attendance updates, grade publishing).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router, React 18, Server & Client Components) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) with Lucide Icons |
| **Backend & APIs** | Next.js Node.js Route Handlers (`src/app/api/...`) |
| **Database ORM** | [Prisma ORM v5](https://www.prisma.io/) |
| **Database Engines** | **PostgreSQL** (Production / Enterprise) & **SQLite** (Default local instant dev) |
| **Authentication** | JWT Session Management & bcryptjs Password Hashing |
| **Language** | TypeScript (100% type-safe) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18.17+ or v20+ / v22+
- **npm** (or pnpm / yarn)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Database Setup & Seeding
EduManage comes pre-configured with **SQLite** for instant zero-configuration local execution:
```bash
# Push Prisma schema to create the local database
npx prisma db push

# Seed realistic demo data (users, classes, teachers, students, attendance, exams, fees)
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Login Credentials

You can log in manually or click the **1-Click Instant Demo Login** cards on the login page:

| Role | Email | Password | Pre-assigned Persona |
|---|---|---|---|
| **Administrator** | `admin@edumanage.com` | `password123` | Dr. Eleanor Vance (Director / Principal) |
| **Teacher** | `sarah.jenkins@edumanage.com` | `password123` | Prof. Sarah Jenkins (Math & Computing / Grade 10-A In-Charge) |
| **Student** | `student@edumanage.com` | `password123` | Alex Rivera (Grade 10 - Section A, Roll #101) |

---

## 🗄️ Database Configuration: PostgreSQL vs. SQLite

EduManage is designed with schema portability so you can run it on PostgreSQL in production or SQLite locally.

### Using PostgreSQL:
1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
2. Update `.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/edumanage?schema=public"
```
3. Run migrations and seed:
```bash
npx prisma db push
npm run db:seed
```

---

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma       # Prisma relational data model
│   └── seed.js             # Realistic seed dataset
├── src/
│   ├── app/
│   │   ├── page.tsx        # Modern institutional landing page
│   │   ├── login/          # Unified role-based authentication
│   │   ├── admin/          # Administrator dashboard & management subpages
│   │   │   ├── students/   # Student CRUD, enrollment modal, CSV export
│   │   │   ├── teachers/   # Faculty directory & department assignments
│   │   │   ├── classes/    # Cohorts, sections, room assignments, courses
│   │   │   ├── attendance/ # School-wide attendance register & analytics
│   │   │   ├── exams/      # Assessments & gradebook sheets
│   │   │   ├── fees/       # Fee invoicing, collection & payment status
│   │   │   └── notices/    # Broadcast circulars publisher
│   │   ├── teacher/        # Teacher portal
│   │   │   ├── attendance/ # Daily class roll call marker
│   │   │   ├── grades/     # Gradebook with real-time GPA calculations
│   │   │   ├── students/   # Assigned class roster & guardian contacts
│   │   │   └── notices/    # Faculty notices
│   │   ├── student/        # Student portal
│   │   │   ├── attendance/ # Personal attendance history
│   │   │   ├── results/    # Official printable report card transcript
│   │   │   ├── fees/       # Invoices & online fee payment simulator
│   │   │   └── notices/    # School announcements
│   │   └── api/            # 16 RESTful API Route Handlers
│   ├── components/         # Reusable UI components, modals, report cards
│   └── lib/                # Prisma client, JWT auth, formatting utilities
└── package.json
```

---

## 📄 Deliverable Information
- **Internship**: CODSOFT Web Development / Software Engineering Internship
- **Task**: TASK 1 — Student Management System
- **Platform**: EduManage Academic Cloud OS
