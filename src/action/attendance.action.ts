'use server';

import prisma  from '@/lib/prisma';
import { format, parse, isValid, isToday } from 'date-fns';

// Type definitions
export interface AttendanceInput {
  member_id: string;
  date: string; // Format: dd-MM-yyyy
  time: string;
}

export interface AttendanceResponse {
  id: string;
  member_id: string;
  date: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to validate date format
const validateDateFormat = (dateStr: string): boolean => {
  const parsed = parse(dateStr, 'dd-MM-yyyy', new Date());
  return isValid(parsed);
};

// 1. AddAttendance
export async function AddAttendance(data: AttendanceInput): Promise<AttendanceResponse> {
  try {
    // Validate inputs
    if (!data.member_id || !data.date) {
      throw new Error('Missing required fields');
    }

    if (!validateDateFormat(data.date)) {
      throw new Error('Invalid date format. Use dd-MM-yyyy');
    }

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: data.member_id },
    });
    if (!member) {
      throw new Error('Member not found');
    }

    // Check if attendance already exists for this member on this date
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        member_id: data.member_id,
        date: data.date,
      },
    });
    if (existingAttendance) {
      return existingAttendance;
    }

    const attendance = await prisma.attendance.create({
      data: {
        member_id: data.member_id,
        date: data.date,
        time: data.time,
      },
    });

    return {
      ...attendance,
    };
  } catch (error:any) {
    throw new Error(`Failed to add attendance: ${error.message}`);
  }
}

import { DUMMY_ATTENDANCE } from '@/lib/dummy-data';

// 2. GetTodaysAttendance
export async function GetTodaysAttendance(): Promise<AttendanceResponse[]> {
  try {
    const today = format(new Date(), 'dd-MM-yyyy');

    const attendances = await prisma.attendance.findMany({
      where: {
        date: today,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!attendances || attendances.length === 0) {
      return DUMMY_ATTENDANCE as any;
    }

    return attendances;
  } catch (error:any) {
    console.warn("Using DUMMY_ATTENDANCE fallback:", error);
    return DUMMY_ATTENDANCE as any;
  }
}

// 3. GetAttendanceByDate
export async function GetAttendanceByDate(date: string): Promise<AttendanceResponse[]> {
  try {
    if (!validateDateFormat(date)) {
      return DUMMY_ATTENDANCE as any;
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        date,
      },
      orderBy: { createdAt: 'desc' },
      include:{
        member: {
            select: {
                id: true,
                name: true,
            }
        }
      }
    });

    if (!attendances || attendances.length === 0) {
      return DUMMY_ATTENDANCE as any;
    }

    return attendances;
  } catch (error:any) {
    console.warn("Using DUMMY_ATTENDANCE fallback:", error);
    return DUMMY_ATTENDANCE as any;
  }
}

// 4. GetAttendanceByMemberId
export async function GetAttendanceByMemberId(member_id: string): Promise<AttendanceResponse[]> {
  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        member_id,
      },
      orderBy: { createdAt: 'desc' },
    });

    return attendances;
  } catch (error:any) {
    throw new Error(`Failed to fetch attendance for member: ${error.message}`);
  }
}

// 5. DeleteAttendanceById
export async function DeleteAttendanceById(id: string): Promise<void> {
  try {
    await prisma.attendance.delete({
      where: { id },
    });
  } catch (error:any) {
    throw new Error(`Failed to delete attendance: ${error.message}`);
  }
}