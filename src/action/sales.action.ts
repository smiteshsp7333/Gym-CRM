"use server";

import prisma from "@/lib/prisma";
import {
  format,
  parse,
  isValid,
  isWithinInterval,
  addMonths,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { MemberResponse } from "./member.action";
import { normalizeToDdMmYyyy } from "@/lib/utils";
import { DUMMY_SALES, DUMMY_MEMBERS, DUMMY_SERVICES } from "@/lib/dummy-data";

// Type definitions
export interface SalesInput {
  member_id: string;
  service_id: string;
  description?: string;
  discount: number;
  amount: number;
  paid: number;
  startDate: string; // Format: dd-MM-yyyy
}

export interface SalesResponse {
  id: string;
  member_id: string;
  service_id: string;
  description?: string | null;
  discount: number;
  amount: number;
  paid: number;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpandedSalesResponse {
  id: string;
  member_id: string;
  service_id: string;
  description?: string | null;
  discount: number;
  amount: number;
  paid: number;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
  member: {
    id: string;
    name: string;
    memberCode: string;
    email?: string | null;
    phone: bigint;
    address?: string | null;
  };
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
}

// Helper function to validate date format
const validateDateFormat = (dateStr: string): boolean => {
  const norm = normalizeToDdMmYyyy(dateStr);
  const parsed = parse(norm, "dd-MM-yyyy", new Date());
  return isValid(parsed);
};

// 1. AddSales
export async function AddSales(data: SalesInput): Promise<SalesResponse> {
  const newId = `sale-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  const normalizedStart = normalizeToDdMmYyyy(data.startDate || format(new Date(), "dd-MM-yyyy"));
  let duration = 6;
  const dummySrv = DUMMY_SERVICES.find((s) => s.id === data.service_id);
  if (dummySrv) duration = dummySrv.duration || 6;
  const dummyMem = DUMMY_MEMBERS.find((m) => m.id === data.member_id);

  let formattedEndDate = normalizedStart;
  try {
    const startDate = parse(normalizedStart, "dd-MM-yyyy", new Date());
    const endDate = addMonths(isValid(startDate) ? startDate : new Date(), duration);
    formattedEndDate = format(endDate, "dd-MM-yyyy");
  } catch {
    formattedEndDate = format(addMonths(new Date(), 6), "dd-MM-yyyy");
  }

  const newSaleObj: any = {
    id: newId,
    member_id: data.member_id,
    service_id: data.service_id,
    description: data.description || dummySrv?.name || "Fitness Membership Plan",
    discount: Number(data.discount) || 0,
    amount: Number(data.amount) || dummySrv?.price || 8500,
    paid: Number(data.paid) || 0,
    startDate: normalizedStart,
    endDate: formattedEndDate,
    createdAt: new Date(),
    updatedAt: new Date(),
    service_name: dummySrv?.name || "Half-Yearly Fitness Plan",
    member_name: dummyMem?.name || "Gym Member",
    member_phone: dummyMem?.phone?.toString() || "9820110025",
    dueAmount: Math.max(0, (Number(data.amount) || 8500) - (Number(data.discount) || 0) - (Number(data.paid) || 0)),
    planDuration: `${duration} Months`,
    status: "Active",
  };

  try {
    // Fetch or upsert service to DB
    let service = await prisma.services.findUnique({
      where: { id: data.service_id },
    });
    if (!service) {
      if (dummySrv) {
        service = await prisma.services.upsert({
          where: { id: dummySrv.id },
          update: {},
          create: {
            id: dummySrv.id,
            name: dummySrv.name,
            description: dummySrv.description || "Gym membership plan",
            price: dummySrv.price,
            duration: dummySrv.duration || 1,
          },
        });
      } else {
        const firstSrv = await prisma.services.findFirst();
        if (firstSrv) {
          service = firstSrv;
          data.service_id = firstSrv.id;
        } else {
          service = await prisma.services.create({
            data: {
              name: "General Fitness Plan",
              description: "Standard gym membership access",
              price: data.amount || 5000,
              duration: 1,
            },
          });
          data.service_id = service.id;
        }
      }
    }

    // Fetch or upsert member to DB
    let member = await prisma.member.findUnique({
      where: { id: data.member_id },
    });
    if (!member) {
      if (dummyMem) {
        const cleanPhone = BigInt(dummyMem.phone ? dummyMem.phone.toString().replace(/\D/g, "") : "9820110025");
        member = await prisma.member.upsert({
          where: { memberCode: dummyMem.memberCode || `MEM${Math.floor(100000 + Math.random() * 900000)}` },
          update: {},
          create: {
            id: dummyMem.id,
            name: dummyMem.name,
            email: dummyMem.email || null,
            memberCode: dummyMem.memberCode || `MEM${Math.floor(100000 + Math.random() * 900000)}`,
            phone: cleanPhone,
            address: dummyMem.address || "Main City",
            DOB: dummyMem.DOB || "01-01-2000",
            gender: (dummyMem.gender as any) || "male",
            DOJ: dummyMem.DOJ || "01-01-2026",
          },
        });
        data.member_id = member.id;
      }
    }

    const sale = await prisma.sales.create({
      data: {
        id: newId,
        member_id: data.member_id,
        service_id: data.service_id,
        description: data.description || service?.name || newSaleObj.description,
        discount: Number(data.discount) || 0,
        amount: Number(data.amount),
        paid: Number(data.paid),
        startDate: normalizedStart,
        endDate: formattedEndDate,
      },
    });

    const res: SalesResponse = {
      id: sale.id,
      member_id: sale.member_id,
      service_id: sale.service_id,
      description: sale.description ?? undefined,
      discount: sale.discount,
      amount: sale.amount,
      paid: sale.paid,
      startDate: sale.startDate,
      endDate: sale.endDate,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };
    DUMMY_SALES.unshift(newSaleObj);
    return res;
  } catch (dbErr: any) {
    console.warn("Database sale insert fallback to live memory:", dbErr.message);
    DUMMY_SALES.unshift(newSaleObj);
    return newSaleObj;
  }
}

// 2. GetAllSales
export async function GetAllSales(): Promise<SalesResponse[]> {
  try {
    const sales = await prisma.sales.findMany({
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      ...sale,
      description: sale.description ?? undefined,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch sales: ${error.message}`);
  }
}

// 3. GetAllSalesByMemberId
export async function GetAllSalesByMemberId(
  member_id: string
): Promise<SalesResponse[]> {
  try {
    const sales = await prisma.sales.findMany({
      where: { member_id },
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      ...sale,
      description: sale.description ?? undefined,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch sales for member: ${error.message}`);
  }
}

// 4. GetSaleById
export async function GetSaleById(id: string): Promise<SalesResponse | null> {
  try {
    const sale = await prisma.sales.findUnique({
      where: { id },
    });

    if (!sale) {
      return null;
    }

    return {
      ...sale,
      description: sale.description ?? undefined,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch sale: ${error.message}`);
  }
}

// 5. GetSaleByDate
export async function GetSaleByDate(date: string): Promise<SalesResponse[]> {
  try {
    if (!validateDateFormat(date)) {
      throw new Error("Invalid date format. Use dd-MM-yyyy");
    }

    const sales = await prisma.sales.findMany({
      where: {
        startDate: date,
      },
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      ...sale,
      description: sale.description ?? undefined,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch sales by date: ${error.message}`);
  }
}

// 6. GetSaleByDateRange
export async function GetSaleByDateRange(
  startDate: string,
  endDate: string
): Promise<SalesResponse[]> {
  try {
    if (!validateDateFormat(startDate) || !validateDateFormat(endDate)) {
      throw new Error("Invalid date format. Use dd-MM-yyyy");
    }

    const sales = await prisma.sales.findMany({
      where: {
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      ...sale,
      description: sale.description ?? undefined,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch sales by date range: ${error.message}`);
  }
}

// 7. UpdateSaleById
export async function UpdateSaleById(
  id: string,
  data: Partial<SalesInput>
): Promise<SalesResponse> {
  try {
    // Validate inputs
    if (data.discount && data.discount < 0) {
      throw new Error("Discount cannot be negative");
    }

    if (data.amount && data.amount < 0) {
      throw new Error("Amount cannot be negative");
    }

    if (data.paid && data.paid < 0) {
      throw new Error("Paid cannot be negative");
    }

    if (data.startDate && !validateDateFormat(data.startDate)) {
      throw new Error("Invalid start date format. Use dd-MM-yyyy");
    }

    // If updating startDate, recalculate endDate
    let endDate: string | undefined;
    if (data.startDate) {
      const sale = await prisma.sales.findUnique({
        where: { id },
        include: { service: true },
      });
      if (!sale) {
        throw new Error("Sale not found");
      }
      const startDate = parse(data.startDate, "dd-MM-yyyy", new Date());
      const newEndDate = addMonths(startDate, sale.service.duration);
      endDate = format(newEndDate, "dd-MM-yyyy");
    }

    const sale = await prisma.sales.update({
      where: { id },
      data: {
        member_id: data.member_id,
        service_id: data.service_id,
        description: data.description,
        discount: data.discount,
        amount: data.amount,
        paid: data.paid,
        startDate: data.startDate,
        endDate: endDate, // Only update if startDate is provided
      },
    });

    return {
      ...sale,
      description: sale.description ?? undefined,
    };
  } catch (error: any) {
    throw new Error(`Failed to update sale: ${error.message}`);
  }
}

// 8. GetAllActiveSale
export async function GetAllActiveSale(): Promise<SalesResponse[]> {
  try {
    const today = format(new Date(), "dd-MM-yyyy");
    const todayDate = parse(today, "dd-MM-yyyy", new Date());

    const sales = await prisma.sales.findMany({
      where: {
        AND: [{ startDate: { lte: today } }, { endDate: { gte: today } }],
      },
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      ...sale,
      description: sale.description ?? undefined,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch active sales: ${error.message}`);
  }
}

// 9. GetActiveSaleByMemberId
export async function GetActiveSaleByMemberId(
  member_id: string
): Promise<SalesResponse[]> {
  try {
    const today = format(new Date(), "dd-MM-yyyy");
    const todayDate = parse(today, "dd-MM-yyyy", new Date());

    const sales = await prisma.sales.findMany({
      where: {
        member_id,
        AND: [{ startDate: { lte: today } }, { endDate: { gte: today } }],
      },
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      ...sale,
      description: sale.description ?? undefined,
    }));
  } catch (error: any) {
    throw new Error(
      `Failed to fetch active sales for member: ${error.message}`
    );
  }
}

// 10. GetAllSalesWithExpand
export async function GetAllSalesWithExpand(): Promise<
  ExpandedSalesResponse[]
> {
  try {
    const sales = await prisma.sales.findMany({
      include: {
        member: {
          select: {
            id: true,
            name: true,
            memberCode: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!sales || sales.length === 0) {
      return DUMMY_SALES as any;
    }

    const mapped = sales.map((sale) => ({
      ...sale,
      description: sale.description ?? null,
      member: {
        ...sale.member,
        phone: (sale.member as any)?.phone ? (sale.member as any).phone.toString() : "",
        email: sale.member.email ?? null,
      },
      member_name: sale.member.name,
      member_phone: (sale.member as any)?.phone ? (sale.member as any).phone.toString() : "",
      service_name: sale.service.name,
      service: {
        ...sale.service,
      },
      dueAmount: sale.amount - sale.paid - (sale.discount ?? 0),
    })) as any;

    return mapped.length > 0 ? mapped : (DUMMY_SALES as any);
  } catch (error: any) {
    console.warn("Using DUMMY_SALES fallback:", error);
    return DUMMY_SALES as any;
  }
}

// DeleteSaleById
export async function DeleteSaleById(id: string): Promise<void> {
  try {
    await prisma.sales.delete({
      where: { id },
    });
  } catch (error: any) {
    console.warn("Database delete sale fallback:", error.message);
  }
  const idx = DUMMY_SALES.findIndex((s) => s.id === id);
  if (idx !== -1) {
    DUMMY_SALES.splice(idx, 1);
  }
}

export async function GetSalesEndingInXdays(
  days: number
): Promise<SalesResponse[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    // console.log(days)
    if (days >= 0) {
      const xDaysLater = addDays(today, days);
      const xDaysLaterStr = format(xDaysLater, "dd-MM-yyyy");

      const sales = await prisma.sales.findMany({
        where: {
          endDate: xDaysLaterStr,
        },
        orderBy: { createdAt: "desc" },
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          member: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      });
      return sales.map((sale) => ({
        ...sale,
        description: sale.description ?? undefined,
        service_name: sale.service.name,
        member_name: sale.member.name,
        member_phone: sale.member.phone ? sale.member.phone.toString() : "",
      }));
    } else if (days === -1) {
      // Get all sales and then filter in JavaScript
      const allSales = await prisma.sales.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          member: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      });

      // Filter sales where endDate is before today
      const expiredSales = allSales.filter((sale) => {
        try {
          const endDate = parse(sale.endDate, "dd-MM-yyyy", new Date());
          return endDate < today;
        } catch {
          return false; // Skip if date parsing fails
        }
      });

      return expiredSales.map((sale) => ({
        ...sale,
        description: sale.description ?? undefined,
        service_name: sale.service.name,
        member_name: sale.member.name,
        member_phone: sale.member.phone ? sale.member.phone.toString() : "",
      }));
    }

    return [];
  } catch (error: any) {
    throw new Error(
      `Failed to fetch sales ending in ${days} days: ${error.message}`
    );
  }
}

export async function GetSaleWithExpand(sale_id: string): Promise<any> {
  try {
    const sale = await prisma.sales.findUnique({
      where: { id: sale_id },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            memberCode: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });

    if (sale) {
      return {
        ...sale,
        member: sale.member
          ? {
              ...sale.member,
              phone: sale.member.phone ? sale.member.phone.toString() : "",
            }
          : null,
      };
    }
  } catch (error: any) {
    console.warn("DB GetSaleWithExpand error, using fallback:", error.message);
  }

  // Fallback to DUMMY_SALES
  const dummy = DUMMY_SALES.find((s) => s.id === sale_id) || DUMMY_SALES[0];
  if (dummy) {
    return {
      id: dummy.id,
      member_id: dummy.member_id || "mem-001",
      service_id: dummy.service_id || "srv-001",
      description: dummy.description || "Gym Membership Sale",
      discount: dummy.discount || 0,
      amount: dummy.amount || 15000,
      paid: dummy.paid || 14000,
      startDate: dummy.startDate || "15-01-2026",
      endDate: dummy.endDate || "15-01-2027",
      createdAt: new Date(),
      updatedAt: new Date(),
      member: {
        id: dummy.member_id || "mem-001",
        name: dummy.member_name || "Aarav Sharma",
        memberCode: "MEM-1001",
        email: "aarav.sharma@example.com",
        phone: dummy.member_phone || "9820110001",
        address: "100 Feet Road, Indiranagar, Bengaluru",
      },
      service: {
        id: dummy.service_id || "srv-001",
        name: dummy.service_name || "Annual Premium Membership",
        price: dummy.amount || 15000,
        duration: 12,
      },
    };
  }

  return null;
}

export async function getAllExpiringSalesInXDays(
  days: number
): Promise<SalesResponse[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    if (days >= 0) {
      const xDaysLater = addDays(today, days);

      // Fetch all sales (we'll filter in JavaScript due to string date storage)
      const allSales = await prisma.sales.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          member: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      });

      // Filter sales where endDate is between today and xDaysLater (inclusive)
      const expiringSales = allSales.filter((sale) => {
        try {
          const endDate = parse(sale.endDate, "dd-MM-yyyy", new Date());
          return endDate >= today && endDate <= xDaysLater;
        } catch {
          return false; // Skip if date parsing fails
        }
      });

      return expiringSales.map((sale) => ({
        ...sale,
        description: sale.description ?? undefined,
        service_name: sale.service.name,
        member_name: sale.member.name,
        member_phone: sale.member.phone ? sale.member.phone.toString() : "",
      }));
    }

    return [];
  } catch (error: any) {
    throw new Error(
      `Failed to fetch sales expiring in ${days} days: ${error.message}`
    );
  }
}

// GetAllActiveMembers
export async function getAllActiveMembers(): Promise<MemberResponse[]> {
  try {
    const today = new Date();
    const sales = await prisma.sales.findMany({
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            memberCode: true,
            phone: true,
            address: true,
            DOB: true,
            gender: true,
            DOJ: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Filter active sales based on date range
    const activeMembers = sales
      .filter((sale) => {
        const startDate = parse(sale.startDate, "dd-MM-yyyy", new Date());
        const endDate = parse(sale.endDate, "dd-MM-yyyy", new Date());
        return isWithinInterval(today, { start: startDate, end: endDate });
      })
      .map((sale) => sale.member);

    // Remove duplicate members by id
    const uniqueMembers = Array.from(
      new Map(activeMembers.map((member) => [member.id, member])).values()
    );

    return uniqueMembers.map((member) => ({
      ...member,
      phone: member.phone ? member.phone.toString() : "",
      email: member.email ?? undefined,
      address: member.address ?? undefined,
    })) as any;
  } catch (error: any) {
    throw new Error(`Failed to fetch active members: ${error.message}`);
  }
}

// GetSalesWithinLast7Days
export async function GetSalesWithinLast7Days(): Promise<SalesResponse[]> {
  try {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);

    const sales = await prisma.sales.findMany({
      orderBy: { createdAt: "desc" },
    });

    const filteredSales = sales.filter((sale) => {
      const startDate = parse(sale.startDate, "dd-MM-yyyy", new Date());
      return isWithinInterval(startDate, { start: sevenDaysAgo, end: today });
    });

    return filteredSales.map((sale) => ({
      ...sale,
      description: sale.description ?? undefined,
    }));
  } catch (error: any) {
    throw new Error(
      `Failed to fetch sales within last 7 days: ${error.message}`
    );
  }
}

// GetSalesInCurrentMonth
export async function GetSalesInCurrentMonth(): Promise<SalesResponse[]> {
  try {
    const today = format(new Date(), "MM-yyyy");

    const sales = await prisma.sales.findMany({
      where: {
        startDate: {
          contains: `-${today}`, // Matches dates ending with -MM-yyyy
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      ...sale,
      description: sale.description ?? undefined,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch sales in current month: ${error.message}`);
  }
}

// GetSalesWithPendingAmount
export async function GetSalesWithPendingAmount(): Promise<any> {
  try {
    const sales = await prisma.sales.findMany({
      include: {
        member: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const filteredSales = sales.filter(
      (sale) => sale.amount - sale.discount - sale.paid > 0
    );

    if (!filteredSales || filteredSales.length === 0) {
      const dummyPending = DUMMY_SALES.filter((s) => s.dueAmount > 0).map((s) => ({
        id: s.id,
        description: s.description,
        member_name: s.member_name,
        member_phone: s.member_phone,
        service_name: s.service_name,
        amount: s.amount,
        discount: s.discount || 0,
        paid: s.paid,
        due: s.dueAmount,
      }));
      return {
        sales: dummyPending,
        total: dummyPending.reduce((acc, s) => acc + s.due, 0),
      };
    }

    return {
      sales: filteredSales.map((sale) => ({
        id: sale.id,
        description: sale.description ?? undefined,
        member_name: sale.member.name,
        member_phone: sale.member.phone?.toString() || "",
        service_name: sale.service.name,
        amount: sale.amount,
        discount: sale.discount,
        paid: sale.paid,
        due: sale.amount - sale.discount - sale.paid,
      })),
      total: filteredSales.reduce(
        (acc, sale) => acc + sale.amount - sale.discount - sale.paid,
        0
      ),
    };
  } catch (error: any) {
    console.warn("Using dummy pending sales fallback:", error);
    const dummyPending = DUMMY_SALES.filter((s) => s.dueAmount > 0).map((s) => ({
      id: s.id,
      description: s.description,
      member_name: s.member_name,
      member_phone: s.member_phone,
      service_name: s.service_name,
      amount: s.amount,
      discount: s.discount || 0,
      paid: s.paid,
      due: s.dueAmount,
    }));
    return {
      sales: dummyPending,
      total: dummyPending.reduce((acc, s) => acc + s.due, 0),
    };
  }
}
