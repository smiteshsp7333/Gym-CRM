'use server';

import prisma  from '@/lib/prisma';
// import { EnquiryType }from '@prisma/client';
import { parse, isValid } from 'date-fns';
import { normalizeToDdMmYyyy } from '@/lib/utils';

type EnquiryType = 'call' | 'walkin' | 'instagram' | 'whatsapp';

export interface EnquiryInput {
  name: string;
  phone: bigint;
  followupDate?: string; // Format: dd-MM-yyyy
  message?: string;
  type: EnquiryType;
}

export interface EnquiryResponse {
  id: string;
  name: string;
  phone: bigint;
  followupDate?: string | null;
  message?: string | null;
  type: EnquiryType;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to validate date format
const validateDateFormat = (dateStr: string): boolean => {
  const norm = normalizeToDdMmYyyy(dateStr);
  const parsed = parse(norm, 'dd-MM-yyyy', new Date());
  return isValid(parsed);
};

// Helper function to validate phone number
const validatePhone = (phone: bigint): boolean => {
  return phone.toString().length === 10;
};

// 1. AddEnquiry
export async function AddEnquiry(data: EnquiryInput): Promise<EnquiryResponse> {
  try {
    // Validate inputs
    if (!data.name || !data.phone || !data.type) {
      throw new Error('Missing required fields');
    }

    if (!validatePhone(data.phone)) {
      throw new Error('Phone number must be 10 digits');
    }

    if (data.followupDate && !validateDateFormat(data.followupDate)) {
      throw new Error('Invalid followup date format. Use dd-MM-yyyy');
    }

    const normalizedFollowup = data.followupDate ? normalizeToDdMmYyyy(data.followupDate) : null;

    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        phone: Number(data.phone),
        followupDate: normalizedFollowup,
        message: data.message,
        type: data.type,
      },
    });

    return {
      ...enquiry,
      followupDate: enquiry.followupDate ?? undefined,
      message: enquiry.message ?? undefined,
    };
  } catch (error:any) {
    throw new Error(`Failed to add enquiry: ${error.message}`);
  }
}

// 2. GetEnquiryById
export async function GetEnquiryById(id: string): Promise<EnquiryResponse | null> {
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return null;
    }

    return {
      ...enquiry,
      followupDate: enquiry.followupDate ?? undefined,
      message: enquiry.message ?? undefined,
    };
  } catch (error:any) {
    throw new Error(`Failed to fetch enquiry: ${error.message}`);
  }
}

// 3. GetAllEnquiry
export async function GetAllEnquiry(): Promise<EnquiryResponse[]> {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return enquiries.map((enquiry) => ({
      ...enquiry,
      phone: (enquiry.phone ? enquiry.phone.toString() : "") as any,
      followupDate: enquiry.followupDate ?? undefined,
      message: enquiry.message ?? undefined,
    })) as any;
  } catch (error: any) {
    console.error("Failed to fetch enquiries:", error);
    return [];
  }
}

// 4. GetEnquiryByFollowupDate
export async function GetEnquiryByFollowupDate(date: string): Promise<EnquiryResponse[]> {
  try {
    if (!validateDateFormat(date)) {
      throw new Error('Invalid date format. Use dd-MM-yyyy');
    }

    const enquiries = await prisma.enquiry.findMany({
      where: {
        followupDate: date,
      },
      orderBy: { createdAt: 'desc' },
    });

    return enquiries.map((enquiry) => ({
      ...enquiry,
      followupDate: enquiry.followupDate ?? undefined,
      message: enquiry.message ?? undefined,
    }));
  } catch (error:any) {
    throw new Error(`Failed to fetch enquiries by followup date: ${error.message}`);
  }
}

// 5. DeleteEnquiry
export async function DeleteEnquiry(id: string): Promise<void> {
  try {
    await prisma.enquiry.delete({
      where: { id },
    });
  } catch (error:any) {
    throw new Error(`Failed to delete enquiry: ${error.message}`);
  }
}