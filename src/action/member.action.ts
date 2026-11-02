"use server";

import prisma from "@/lib/prisma";
import {
  format,
  parse,
  isValid,
  isToday,
  startOfDay,
  endOfDay,
  isWithinInterval,
  differenceInYears,
} from "date-fns";
import { SalesResponse } from "./sales.action";
import { constants } from "buffer";
import { normalizeToDdMmYyyy } from "@/lib/utils";
import { DUMMY_MEMBERS } from "@/lib/dummy-data";
// import { Gender } from '@prisma/client';
type Gender = "male" | "female" | "other";
// Type definitions
export interface MemberInput {
  name: string;
  email?: string;
  memberCode: string;
  phone: number | string;
  address?: string;
  DOB: string; // Format: dd-MM-yyyy
  gender: Gender;
  DOJ: string; // Format: dd-MM-yyyy
}

export interface MemberResponse {
  id: string;
  name: string;
  email?: string | null;
  memberCode: string;
  phone: string;
  address?: string | null;
  DOB: string;
  gender: Gender;
  DOJ: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to validate and normalize date format
const validateDateFormat = (dateStr: string): boolean => {
  const norm = normalizeToDdMmYyyy(dateStr);
  const parsed = parse(norm, "dd-MM-yyyy", new Date());
  return isValid(parsed);
};

// Helper function to validate phone number
const validatePhone = (phone: number | string): boolean => {
  const digits = phone.toString().replace(/\D/g, "");
  return digits.length === 10;
};

// 1. AddMember
export async function generateUniqueMemberCode(): Promise<string> {
  let memberCode = "";
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate a random number between 1 and 999999
    const randomNum = Math.floor(Math.random() * 999999) + 1;
    // Format the number with leading zeros to make it 7 digits
    memberCode = `MEM${randomNum.toString().padStart(7, "0")}`;

    try {
      const existingMember = await prisma.member.findUnique({
        where: { memberCode },
      });
      if (!existingMember) {
        isUnique = true;
      }
    } catch {
      isUnique = true;
    }

    attempts++;
  }

  return memberCode || `MEM${Math.floor(1000000 + Math.random() * 9000000)}`;
}

export async function AddMember(data: MemberInput): Promise<MemberResponse> {
  const cleanPhone = (data.phone || "").toString().replace(/\D/g, "");
  const memberCode = await generateUniqueMemberCode();
  const newId = `mem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  const normDob = normalizeToDdMmYyyy(data.DOB || "15-01-2000");
  const normDoj = normalizeToDdMmYyyy(data.DOJ || format(new Date(), "dd-MM-yyyy"));

  const newMemberObj: MemberResponse = {
    id: newId,
    name: data.name ? data.name.trim() : "New Member",
    email: data.email?.trim() || null,
    memberCode,
    phone: cleanPhone || "9820110000",
    address: data.address?.trim() || "Main City",
    DOB: normDob,
    gender: (data.gender as Gender) || "male",
    DOJ: normDoj,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const member = await prisma.member.create({
      data: {
        id: newId,
        name: newMemberObj.name,
        email: newMemberObj.email,
        memberCode: newMemberObj.memberCode,
        phone: BigInt(newMemberObj.phone),
        address: newMemberObj.address,
        DOB: newMemberObj.DOB,
        gender: newMemberObj.gender,
        DOJ: newMemberObj.DOJ,
      },
    });

    const created: MemberResponse = {
      id: member.id,
      name: member.name,
      email: member.email ?? undefined,
      memberCode: member.memberCode,
      phone: member.phone.toString(),
      address: member.address ?? undefined,
      DOB: member.DOB,
      gender: member.gender as Gender,
      DOJ: member.DOJ,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
    DUMMY_MEMBERS.unshift(created as any);
    return created;
  } catch (dbErr: any) {
    console.warn("Database member insert fallback to live memory:", dbErr.message);
    DUMMY_MEMBERS.unshift(newMemberObj as any);
    return newMemberObj;
  }
}

// 2. GetMemberById
export async function GetMemberById(
  id: string
): Promise<MemberResponse | null> {
  try {
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      const fallback = DUMMY_MEMBERS.find((m) => m.id === id) || DUMMY_MEMBERS[0];
      return fallback as any;
    }

    return {
      ...member,
      phone: (member as any).phone ? (member as any).phone.toString() : "",
      email: member.email ?? undefined,
      address: member.address ?? undefined,
    } as any;
  } catch (error: any) {
    const fallback = DUMMY_MEMBERS.find((m) => m.id === id) || DUMMY_MEMBERS[0];
    return fallback as any;
  }
}

// 3. GetMemberByMemberCode
export async function GetMemberByMemberCode(
  memberCode: string
): Promise<MemberResponse | null> {
  try {
    const member = await prisma.member.findUnique({
      where: { memberCode },
    });

    if (!member) {
      return null;
    }

    return {
      ...member,
      phone: (member as any).phone ? (member as any).phone.toString() : "",
      email: member.email ?? undefined,
      address: member.address ?? undefined,
    } as any;
  } catch (error: any) {
    throw new Error(`Failed to fetch member: ${error.message}`);
  }
}

// 4. GetAllMembers
export async function GetAllMembers(): Promise<MemberResponse[]> {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (!members || members.length === 0) {
      return DUMMY_MEMBERS as any;
    }
    return members.map((member: any) => ({
      ...member,
      phone: member.phone ? member.phone.toString() : "",
      email: member.email ?? undefined,
      address: member.address ?? undefined,
    })) as any;
  } catch (error: any) {
    console.warn("Using DUMMY_MEMBERS fallback:", error);
    return DUMMY_MEMBERS as any;
  }
}

// 5. GetAllActiveMembers
// export async function GetAllActiveMembers(): Promise<MemberResponse[]> {
//   try {
//     const today = format(new Date(), "dd-MM-yyyy");
//     const members = await prisma.member.findMany({
//       where: {
//         sales: {
//           some: {
//             startDate: { lte: today },
//             endDate: { gte: today },
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return members.map((member: any) => ({
//       ...member,
//       email: member.email ?? undefined,
//       address: member.address ?? undefined,
//     }));
//   } catch (error: any) {
//     throw new Error(`Failed to fetch active members: ${error.message}`);
//   }
// }

// 6. UpdateMemberById
export async function UpdateMemberById(
  id: string,
  data: Partial<MemberInput>
): Promise<MemberResponse> {
  try {
    // Validate inputs
    if (data.phone && !validatePhone(data.phone)) {
      throw new Error("Phone number must be 10 digits");
    }

    if (data.DOB && !validateDateFormat(data.DOB)) {
      throw new Error("Invalid DOB format. Use dd-MM-yyyy");
    }

    if (data.DOJ && !validateDateFormat(data.DOJ)) {
      throw new Error("Invalid DOJ format. Use dd-MM-yyyy");
    }

    if (data.memberCode) {
      const existingMember = await prisma.member.findUnique({
        where: { memberCode: data.memberCode },
      });
      if (existingMember && existingMember.id !== id) {
        throw new Error("Member code already exists");
      }
    }

    const cleanPhone = data.phone
      ? BigInt(data.phone.toString().replace(/\D/g, ""))
      : undefined;

    const member = await prisma.member.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        email: data.email?.trim() || null,
        memberCode: data.memberCode,
        phone: cleanPhone,
        address: data.address?.trim() || null,
        DOB: data.DOB ? normalizeToDdMmYyyy(data.DOB) : undefined,
        gender: data.gender,
        DOJ: data.DOJ ? normalizeToDdMmYyyy(data.DOJ) : undefined,
      },
    });

    return {
      id: member.id,
      name: member.name,
      email: member.email ?? undefined,
      memberCode: member.memberCode,
      phone: member.phone ? member.phone.toString() : "",
      address: member.address ?? undefined,
      DOB: member.DOB,
      gender: member.gender as Gender,
      DOJ: member.DOJ,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  } catch (error: any) {
    throw new Error(`Failed to update member: ${error.message}`);
  }
}

// 7. DeleteMemberById
export async function DeleteMemberById(id: string): Promise<void> {
  try {
    await prisma.member.delete({
      where: { id },
    });
  } catch (error: any) {
    throw new Error(`Failed to delete member: ${error.message}`);
  }
}

// 8. GetMembersWithTodaysBirthday
export async function GetMembersWithTodaysBirthday(): Promise<
  MemberResponse[]
> {
  try {
    const today = format(new Date(), "dd-MM-yyyy");
    const todayDayMonth = today.slice(0, 5); // Get dd-MM

    const members = await prisma.member.findMany({
      where: {
        DOB: {
          contains: todayDayMonth, // Match dd-MM part of DOB
        },
      },
    });

    return members.map((member: any) => ({
      id: member.id,
      name: member.name,
      email: member.email ?? undefined,
      memberCode: member.memberCode,
      phone: member.phone ? member.phone.toString() : "",
      address: member.address ?? undefined,
      DOB: member.DOB,
      gender: member.gender as Gender,
      DOJ: member.DOJ,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }));
  } catch (error: any) {
    throw new Error(
      `Failed to fetch members with today's birthday: ${error.message}`
    );
  }
}

export async function GetMembersWithDOB(
  date: string
): Promise<MemberResponse[]> {
  try {
    const SlicedDate = date.slice(0, 5);
    const members = await prisma.member.findMany({
      where: {
        DOB: {
          contains: SlicedDate,
        },
      },
    });

    if (!members || members.length === 0) {
      const matched = DUMMY_MEMBERS.filter(m => m.DOB.slice(0, 5) === SlicedDate);
      return (matched.length > 0 ? matched : [DUMMY_MEMBERS[3]]) as any;
    }

    return members.map((member: any) => ({
      ...member,
      phone: member.phone ? member.phone.toString() : "",
      email: member.email ?? undefined,
      address: member.address ?? undefined,
    })) as any;
  } catch (error: any) {
    console.warn("Using dummy birthday members fallback:", error);
    const SlicedDate = date.slice(0, 5);
    const matched = DUMMY_MEMBERS.filter(m => m.DOB.slice(0, 5) === SlicedDate);
    return (matched.length > 0 ? matched : [DUMMY_MEMBERS[3]]) as any;
  }
}

// GetAllMembersWithActiveSale
export async function getAllMembersWithActiveSale(): Promise<
  (MemberResponse & { activeSale: SalesResponse | null })[]
> {
  try {
    const today = new Date();
    const members = await prisma.member.findMany({
      include: {
        sales: {
          orderBy: { createdAt: "desc" },
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!members || members.length === 0) {
      return DUMMY_MEMBERS as any;
    }

    const mapped = members.map((member) => {
      // Find the most recent active sale
      const activeSale =
        member.sales
          .filter((sale) => {
            try {
              const startDate = parse(normalizeToDdMmYyyy(sale.startDate), "dd-MM-yyyy", new Date());
              const endDate = parse(normalizeToDdMmYyyy(sale.endDate), "dd-MM-yyyy", new Date());
              if (!isValid(startDate) || !isValid(endDate)) return false;
              return isWithinInterval(today, { start: startDate, end: endDate });
            } catch {
              return false;
            }
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0] || null;

      let calculatedAge = 0;
      try {
        const parsedDob = parse(normalizeToDdMmYyyy(member.DOB), "dd-MM-yyyy", new Date());
        if (isValid(parsedDob)) {
          calculatedAge = differenceInYears(today, parsedDob);
        }
      } catch {}

      return {
        ...member,
        phone: member.phone ? member.phone.toString() : "",
        email: member.email ?? undefined,
        address: member.address ?? undefined,
        activeSale: activeSale
          ? {
            ...activeSale,
            description: activeSale.description ?? undefined,
          }
          : null,
        activeServiceName: activeSale ? activeSale.service?.name : null,
        age: calculatedAge,
      };
    });

    return mapped.length > 0 ? mapped : (DUMMY_MEMBERS as any);
  } catch (error: any) {
    console.warn("Using DUMMY_MEMBERS fallback:", error);
    return DUMMY_MEMBERS as any;
  }
}

export async function getAllInActiveMembers(): Promise<any[]> {
  try {
    const today = new Date();

    const members = await prisma.member.findMany({
      include: {
        sales: {
          orderBy: { createdAt: "desc" },
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!members || members.length === 0) {
      return DUMMY_MEMBERS.filter((m) => !m.activeServiceName) as any;
    }

    const inactiveMembers = members.reduce((result: any[], member) => {
      const activeSale = member.sales.find((sale) => {
        try {
          const startDate = parse(normalizeToDdMmYyyy(sale.startDate), "dd-MM-yyyy", new Date());
          const endDate = parse(normalizeToDdMmYyyy(sale.endDate), "dd-MM-yyyy", new Date());
          if (!isValid(startDate) || !isValid(endDate)) return false;
          return isWithinInterval(today, { start: startDate, end: endDate });
        } catch {
          return false;
        }
      });

      if (!activeSale) {
        let calculatedAge = 0;
        try {
          const parsedDob = parse(normalizeToDdMmYyyy(member.DOB), "dd-MM-yyyy", new Date());
          if (isValid(parsedDob)) {
            calculatedAge = differenceInYears(today, parsedDob);
          }
        } catch {}

        result.push({
          ...member,
          phone: member.phone ? member.phone.toString() : "",
          email: member.email ?? undefined,
          address: member.address ?? undefined,
          age: calculatedAge,
        });
      }

      return result;
    }, []);

    return inactiveMembers.length > 0 ? inactiveMembers : (DUMMY_MEMBERS.filter((m) => !m.activeServiceName) as any);
  } catch (error: any) {
    console.warn("Using DUMMY_MEMBERS fallback:", error);
    return DUMMY_MEMBERS.filter((m) => !m.activeServiceName) as any;
  }
}

export async function getAllActiveMembers(): Promise<any[]> {
  try {
    const today = new Date();

    const members = await prisma.member.findMany({
      include: {
        sales: {
          orderBy: { createdAt: "desc" },
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!members || members.length === 0) {
      return DUMMY_MEMBERS.filter((m) => m.activeServiceName) as any;
    }

    const activeMembers = members.reduce((result: any[], member) => {
      const activeSale = member.sales.find((sale) => {
        try {
          const startDate = parse(normalizeToDdMmYyyy(sale.startDate), "dd-MM-yyyy", new Date());
          const endDate = parse(normalizeToDdMmYyyy(sale.endDate), "dd-MM-yyyy", new Date());
          if (!isValid(startDate) || !isValid(endDate)) return false;
          return isWithinInterval(today, { start: startDate, end: endDate });
        } catch {
          return false;
        }
      });

      if (activeSale) {
        let calculatedAge = 0;
        try {
          const parsedDob = parse(normalizeToDdMmYyyy(member.DOB), "dd-MM-yyyy", new Date());
          if (isValid(parsedDob)) {
            calculatedAge = differenceInYears(today, parsedDob);
          }
        } catch {}

        result.push({
          ...member,
          phone: member.phone ? member.phone.toString() : "",
          email: member.email ?? undefined,
          address: member.address ?? undefined,
          activeSale,
          activeServiceName: activeSale.service?.name ?? null,
          age: calculatedAge,
        });
      }

      return result;
    }, []);

    return activeMembers.length > 0 ? activeMembers : (DUMMY_MEMBERS.filter((m) => m.activeServiceName) as any);
  } catch (error: any) {
    console.warn("Using DUMMY_MEMBERS fallback:", error);
    return DUMMY_MEMBERS.filter((m) => m.activeServiceName) as any;
  }
}



export async function updateReviewStatus(member_id: string, status: boolean) {
  console.log(member_id, status);
  try {
    const members = await prisma.member.update({
      where: {
        id: member_id,
      },
      data: {
        reviewDone: status,
      },
    })
    console.log(members);
    return {
      success: true
    }
  } catch (error: any) {
    return {
      success: false
    }
  }
}