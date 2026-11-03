"use client";

import {
  DUMMY_MEMBERS,
  DUMMY_SERVICES,
  DUMMY_SALES,
  DUMMY_ENQUIRIES,
  DUMMY_ATTENDANCE,
  DummyMember,
  DummyService,
} from "./dummy-data";
export type { DummyMember, DummyService };
import { format, parse, isValid, addMonths, differenceInDays } from "date-fns";

const KEYS = {
  MEMBERS: "gym_members",
  SALES: "gym_sales",
  ENQUIRIES: "gym_enquiries",
  ATTENDANCE: "gym_attendance",
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function notifyStoreUpdate() {
  if (isBrowser()) {
    window.dispatchEvent(new Event("gym_store_updated"));
  }
}

// -------------------------------------------------------------
// MEMBERS STORE
// -------------------------------------------------------------
export function getStoreMembers(): DummyMember[] {
  if (!isBrowser()) return DUMMY_MEMBERS;

  const raw = localStorage.getItem(KEYS.MEMBERS);
  if (!raw) {
    try {
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(DUMMY_MEMBERS));
    } catch {}
    return DUMMY_MEMBERS;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure seed dummy members exist if not yet in store
      const existingIds = new Set(parsed.map((m: any) => m.id));
      const missingDummy = DUMMY_MEMBERS.filter((m) => !existingIds.has(m.id));
      if (missingDummy.length > 0) {
        const merged = [...parsed, ...missingDummy];
        localStorage.setItem(KEYS.MEMBERS, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
  } catch {}

  return DUMMY_MEMBERS;
}

export function getStoreMemberById(id: string): DummyMember | null {
  const members = getStoreMembers();
  return members.find((m) => m.id === id) || null;
}

export function addStoreMember(
  data: Partial<DummyMember> & { name: string; phone: string }
): DummyMember {
  const members = getStoreMembers();
  const newId = `mem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const codeNum = 1000 + members.length + 1;
  const memberCode = data.memberCode || `MEM-${codeNum}`;

  const cleanPhone = (data.phone || "").toString().replace(/\D/g, "");

  const newMember: DummyMember = {
    id: data.id || newId,
    name: data.name.trim(),
    email: data.email?.trim() || `${data.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    memberCode,
    phone: cleanPhone,
    address: data.address?.trim() || "Local City",
    DOB: data.DOB || "15-08-1998",
    DOJ: data.DOJ || format(new Date(), "dd-MM-yyyy"),
    gender: (data.gender as any) || "male",
    reviewDone: false,
    activeServiceName: data.activeServiceName || null,
    activeSale: data.activeSale || null,
    age: data.age || 26,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [newMember, ...members.filter((m) => m.id !== newMember.id)];
  if (isBrowser()) {
    try {
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(updatedList));
      notifyStoreUpdate();
    } catch {}
  }

  return newMember;
}

export function updateStoreMember(
  id: string,
  updates: Partial<DummyMember>
): DummyMember | null {
  const members = getStoreMembers();
  const idx = members.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  const current = members[idx];
  const updated: DummyMember = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  members[idx] = updated;
  if (isBrowser()) {
    try {
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
      notifyStoreUpdate();
    } catch {}
  }
  return updated;
}

// -------------------------------------------------------------
// SERVICES STORE
// -------------------------------------------------------------
export function getStoreServices(): DummyService[] {
  return DUMMY_SERVICES;
}

// -------------------------------------------------------------
// SALES STORE
// -------------------------------------------------------------
export function getStoreSales(): any[] {
  if (!isBrowser()) return DUMMY_SALES;

  const raw = localStorage.getItem(KEYS.SALES);
  if (!raw) {
    try {
      localStorage.setItem(KEYS.SALES, JSON.stringify(DUMMY_SALES));
    } catch {}
    return DUMMY_SALES;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map((s: any) => s.id));
      const missingDummy = DUMMY_SALES.filter((s) => !existingIds.has(s.id));
      if (missingDummy.length > 0) {
        const merged = [...parsed, ...missingDummy];
        localStorage.setItem(KEYS.SALES, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
  } catch {}

  return DUMMY_SALES;
}

export function getStoreSaleById(saleId: string): any | null {
  const sales = getStoreSales();
  const found = sales.find((s) => s.id === saleId);
  if (!found) return null;

  // Enrich with member and service records if not already populated
  const member = found.member || getStoreMemberById(found.member_id) || {
    id: found.member_id,
    name: found.member_name || "Gym Athlete",
    phone: found.member_phone || "9820110001",
    email: "athlete@example.com",
    address: "Bengaluru, Karnataka",
    memberCode: "MEM-1001",
  };

  const service = found.service || getStoreServices().find((s) => s.id === found.service_id) || {
    id: found.service_id,
    name: found.service_name || "Annual Premium Membership",
    price: found.amount || 15000,
    duration: 12,
  };

  return {
    ...found,
    member,
    service,
  };
}

export function addStoreSale(data: {
  member_id: string;
  service_id: string;
  startDate: string;
  amount: number;
  discount?: number;
  paid: number;
  description?: string;
  paymentMode?: string;
}): any {
  const sales = getStoreSales();
  const services = getStoreServices();
  const srv = services.find((s) => s.id === data.service_id);
  const mem = getStoreMemberById(data.member_id);

  const durationMonths = srv?.duration || 6;
  const startStr = data.startDate || format(new Date(), "dd-MM-yyyy");

  let endStr = startStr;
  try {
    const parsedStart = parse(startStr, "dd-MM-yyyy", new Date());
    const endDate = addMonths(isValid(parsedStart) ? parsedStart : new Date(), durationMonths);
    endStr = format(endDate, "dd-MM-yyyy");
  } catch {
    endStr = format(addMonths(new Date(), 6), "dd-MM-yyyy");
  }

  const newId = `sale-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const discount = Number(data.discount) || 0;
  const amount = Number(data.amount) || srv?.price || 8500;
  const paid = Number(data.paid) || 0;
  const dueAmount = Math.max(0, amount - discount - paid);

  const newSale: any = {
    id: newId,
    member_id: data.member_id,
    service_id: data.service_id,
    member_name: mem?.name || "Gym Athlete",
    member_phone: mem?.phone || "9820110025",
    service_name: srv?.name || "Membership Plan",
    amount,
    discount,
    paid,
    dueAmount,
    startDate: startStr,
    endDate: endStr,
    description: data.description || `${srv?.name || "Fitness"} Plan`,
    paymentMode: data.paymentMode || "UPI",
    createdAt: new Date().toISOString(),
    member: mem || {
      id: data.member_id,
      name: "Gym Athlete",
      phone: "9820110025",
      address: "Bengaluru",
      memberCode: "MEM-1001",
    },
    service: srv || {
      id: data.service_id,
      name: "Membership Plan",
      price: amount,
      duration: durationMonths,
    },
  };

  const updatedSales = [newSale, ...sales.filter((s) => s.id !== newSale.id)];
  if (isBrowser()) {
    try {
      localStorage.setItem(KEYS.SALES, JSON.stringify(updatedSales));
    } catch {}
  }

  // CRUCIAL: Automatically update the Member's active service status
  if (mem) {
    updateStoreMember(mem.id, {
      activeServiceName: srv?.name || "Membership Plan",
      activeSale: newSale,
    });
  }

  notifyStoreUpdate();
  return newSale;
}

export function deleteStoreSale(saleId: string): void {
  const sales = getStoreSales();
  const targetSale = sales.find((s) => s.id === saleId);
  const updatedSales = sales.filter((s) => s.id !== saleId);

  if (isBrowser()) {
    try {
      localStorage.setItem(KEYS.SALES, JSON.stringify(updatedSales));
    } catch {}
  }

  // If deleted sale belonged to a member, check if they have any remaining active sales
  if (targetSale?.member_id) {
    const remainingForMem = updatedSales.filter((s) => s.member_id === targetSale.member_id);
    if (remainingForMem.length === 0) {
      updateStoreMember(targetSale.member_id, {
        activeServiceName: null,
        activeSale: null,
      });
    } else {
      updateStoreMember(targetSale.member_id, {
        activeServiceName: remainingForMem[0].service_name,
        activeSale: remainingForMem[0],
      });
    }
  }

  notifyStoreUpdate();
}

// -------------------------------------------------------------
// ENQUIRIES / LEADS STORE
// -------------------------------------------------------------
export function getStoreEnquiries(): any[] {
  if (!isBrowser()) return DUMMY_ENQUIRIES;

  const raw = localStorage.getItem(KEYS.ENQUIRIES);
  if (!raw) {
    try {
      localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(DUMMY_ENQUIRIES));
    } catch {}
    return DUMMY_ENQUIRIES;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map((e: any) => e.id));
      const missingDummy = DUMMY_ENQUIRIES.filter((e) => !existingIds.has(e.id));
      if (missingDummy.length > 0) {
        const merged = [...parsed, ...missingDummy];
        localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
  } catch {}

  return DUMMY_ENQUIRIES;
}

export function addStoreEnquiry(data: {
  name: string;
  phone: string;
  type: string;
  followupDate: string;
  message?: string;
}): any {
  const enquiries = getStoreEnquiries();
  const newId = `enq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const cleanPhone = (data.phone || "").toString().replace(/\D/g, "");

  const newEnquiry = {
    id: newId,
    name: data.name.trim(),
    phone: cleanPhone,
    type: data.type || "walkin",
    followupDate: data.followupDate || format(new Date(), "dd-MM-yyyy"),
    message: data.message?.trim() || "General fitness inquiry",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  const updated = [newEnquiry, ...enquiries.filter((e) => e.id !== newId)];
  if (isBrowser()) {
    try {
      localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(updated));
      notifyStoreUpdate();
    } catch {}
  }
  return newEnquiry;
}

export function markEnquiryConverted(enquiryId: string): void {
  const enquiries = getStoreEnquiries();
  const updated = enquiries.map((e) =>
    e.id === enquiryId ? { ...e, status: "converted" } : e
  );
  if (isBrowser()) {
    try {
      localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(updated));
      notifyStoreUpdate();
    } catch {}
  }
}

// -------------------------------------------------------------
// ATTENDANCE STORE
// -------------------------------------------------------------
export function getStoreAttendance(targetDate?: string): any[] {
  if (!isBrowser()) return DUMMY_ATTENDANCE;

  const raw = localStorage.getItem(KEYS.ATTENDANCE);
  let list = DUMMY_ATTENDANCE;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    } catch {}
  } else {
    try {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(DUMMY_ATTENDANCE));
    } catch {}
  }

  if (targetDate) {
    return list.filter((a) => a.date === targetDate);
  }
  return list;
}

export function recordStoreAttendance(
  memberId: string,
  method: "kiosk" | "biometric" | "manual" = "kiosk"
): { success: boolean; member?: DummyMember; message?: string } {
  const mem = getStoreMemberById(memberId);
  if (!mem) {
    return { success: false, message: "Member not found" };
  }

  const today = format(new Date(), "dd-MM-yyyy");
  const time = format(new Date(), "hh:mm a");
  const attendanceList = getStoreAttendance();

  // Check if already checked in today
  const existing = attendanceList.find(
    (a) => a.member_id === memberId && a.date === today
  );
  if (existing) {
    return {
      success: true,
      member: mem,
      message: `Already checked in today at ${existing.time}`,
    };
  }

  const newRecord = {
    id: `att-${Date.now().toString(36)}`,
    member_id: mem.id,
    member_name: mem.name,
    member_code: mem.memberCode,
    phone: mem.phone,
    date: today,
    time,
    method,
    status: "Present",
  };

  const updated = [newRecord, ...attendanceList];
  if (isBrowser()) {
    try {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(updated));
      notifyStoreUpdate();
    } catch {}
  }

  return {
    success: true,
    member: mem,
    message: `Welcome, ${mem.name}! Check-in recorded at ${time}.`,
  };
}

// -------------------------------------------------------------
// DERIVED OPERATIONAL RETENTION RADARS
// -------------------------------------------------------------
export function getExpiringMembers(days: number = 7): any[] {
  const sales = getStoreSales();
  const today = new Date();
  const expiring: any[] = [];

  for (const s of sales) {
    if (s.endDate) {
      try {
        const parsed = parse(s.endDate, "dd-MM-yyyy", new Date());
        if (isValid(parsed)) {
          const diff = differenceInDays(parsed, today);
          if (diff <= days && diff >= -15) {
            expiring.push({
              ...s,
              daysLeft: diff,
              isExpired: diff < 0,
            });
          }
        }
      } catch {}
    }
  }

  expiring.sort((a, b) => a.daysLeft - b.daysLeft);
  return expiring;
}

export function getTodayBirthdays(targetDate?: string): DummyMember[] {
  const members = getStoreMembers();
  const searchDate = targetDate || format(new Date(), "dd-MM-yyyy");
  const targetDayMonth = searchDate.slice(0, 5); // "DD-MM"

  return members.filter((m) => m.DOB && m.DOB.slice(0, 5) === targetDayMonth);
}
