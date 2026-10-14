import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'edumanage-super-secret-key-codsoft-2026';

export interface AuthSession {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  avatar?: string | null;
  studentId?: string | null;
  teacherId?: string | null;
  classId?: string | null;
}

export function signToken(payload: AuthSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSession;
  } catch (err) {
    return null;
  }
}

export function getSessionFromCookies(): AuthSession | null {
  const cookieStore = cookies();
  const token = cookieStore.get('edumanage_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}
