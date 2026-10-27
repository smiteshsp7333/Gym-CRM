import prisma from "@/lib/prisma";
import { Gender, EnquiryType } from "@prisma/client";

export async function clearPitchDatabase() {
  console.log("🧹 Clearing existing demo data...");
  await prisma.attendance.deleteMany().catch(() => {});
  await prisma.fitnessRecord.deleteMany().catch(() => {});
  await prisma.sales.deleteMany().catch(() => {});
  await prisma.member.deleteMany().catch(() => {});
  await prisma.services.deleteMany().catch(() => {});
  await prisma.enquiry.deleteMany().catch(() => {});
  await prisma.toDo.deleteMany().catch(() => {});
  await prisma.foodItems.deleteMany().catch(() => {});
  await prisma.exercise.deleteMany().catch(() => {});
  console.log("✅ Database cleared!");
}

export async function runPitchSeed({ clear = false }: { clear?: boolean } = {}) {
  if (clear) {
    await clearPitchDatabase();
  }

  // Check if members already exist
  const existingMembersCount = await prisma.member.count();
  if (existingMembersCount > 0 && !clear) {
    return {
      success: true,
      alreadySeeded: true,
      message: `Database already has ${existingMembersCount} members. Use clear=true if you want a complete reset.`,
      counts: {
        members: existingMembersCount,
        services: await prisma.services.count(),
        sales: await prisma.sales.count(),
      },
    };
  }

  // 1. Services
  const sAnnual = await prisma.services.create({
    data: {
      name: "Annual Premium Membership",
      description: "Full access to gym floor, cardio equipment, steam bath, and locker facilities for 12 months.",
      price: 15000,
      duration: 12,
    },
  });

  const sHalfYearly = await prisma.services.create({
    data: {
      name: "Half-Yearly Fitness Plan",
      description: "6 months access to strength & conditioning floor and general trainer guidance.",
      price: 8500,
      duration: 6,
    },
  });

  const sQuarterly = await prisma.services.create({
    data: {
      name: "Quarterly Regular Plan",
      description: "3 months standard gym membership with personalized workout card.",
      price: 4800,
      duration: 3,
    },
  });

  const sMonthly = await prisma.services.create({
    data: {
      name: "Monthly Access Pass",
      description: "1 month unlimited gym floor access.",
      price: 2000,
      duration: 1,
    },
  });

  const sPT = await prisma.services.create({
    data: {
      name: "Personal Training (3 Months)",
      description: "Dedicated certified 1-on-1 personal trainer, custom workout & weekly progress tracking.",
      price: 12000,
      duration: 3,
    },
  });

  const sZumba = await prisma.services.create({
    data: {
      name: "Zumba & Aerobics (Monthly)",
      description: "High-energy group dance workout batch (Mon-Fri evening batches).",
      price: 2500,
      duration: 1,
    },
  });

  const sCardioCrossfit = await prisma.services.create({
    data: {
      name: "Cardio & HIIT Special (Quarterly)",
      description: "Cross-training, HIIT, rowing, functional battle ropes, and agility drills.",
      price: 5500,
      duration: 3,
    },
  });

  const sYoga = await prisma.services.create({
    data: {
      name: "Yoga & Flexibility (Monthly)",
      description: "Morning guided Hatha & Vinyasa yoga sessions with breathwork.",
      price: 2200,
      duration: 1,
    },
  });

  // 2. Members (28 Indian members)
  const memberData = [
    { name: "Aarav Sharma", phone: BigInt("9820110001"), gender: Gender.male, dob: "14-05-1995", doj: "15-01-2026", addr: "Sector 14, HSR Layout", code: "MEM-1001", review: true },
    { name: "Rohan Mehta", phone: BigInt("9820110002"), gender: Gender.male, dob: "22-08-1992", doj: "10-02-2026", addr: "Koramangala 4th Block", code: "MEM-1002", review: true },
    { name: "Priya Patel", phone: BigInt("9820110003"), gender: Gender.female, dob: "09-11-1997", doj: "01-03-2026", addr: "Indiranagar 100ft Road", code: "MEM-1003", review: false },
    { name: "Ananya Iyer", phone: BigInt("9820110004"), gender: Gender.female, dob: "27-10-1996", doj: "12-04-2026", addr: "Jayanagar 5th Block", code: "MEM-1004", review: true }, // Birthday today!
    { name: "Vikram Malhotra", phone: BigInt("9820110005"), gender: Gender.male, dob: "03-02-1988", doj: "20-04-2026", addr: "Whitefield Main Road", code: "MEM-1005", review: true },
    { name: "Sneha Reddy", phone: BigInt("9820110006"), gender: Gender.female, dob: "18-07-1999", doj: "05-05-2026", addr: "BTM Layout 2nd Stage", code: "MEM-1006", review: false },
    { name: "Rahul Verma", phone: BigInt("9820110007"), gender: Gender.male, dob: "30-01-1994", doj: "15-05-2026", addr: "JP Nagar Phase 3", code: "MEM-1007", review: true },
    { name: "Neha Joshi", phone: BigInt("9820110008"), gender: Gender.female, dob: "28-10-1998", doj: "01-06-2026", addr: "Electronic City Phase 1", code: "MEM-1008", review: false }, // Birthday tomorrow!
    { name: "Amit Deshmukh", phone: BigInt("9820110009"), gender: Gender.male, dob: "11-09-1990", doj: "10-06-2026", addr: "Sarjapur Road", code: "MEM-1009", review: true },
    { name: "Pooja Nair", phone: BigInt("9820110010"), gender: Gender.female, dob: "05-12-1995", doj: "25-06-2026", addr: "Bellandur Outer Ring Road", code: "MEM-1010", review: false },
    { name: "Aditya Kulkarni", phone: BigInt("9820110011"), gender: Gender.male, dob: "28-03-1993", doj: "02-07-2026", addr: "Marathahalli Bridge", code: "MEM-1011", review: true },
    { name: "Tanvi Gupta", phone: BigInt("9820110012"), gender: Gender.female, dob: "16-06-2000", doj: "15-07-2026", addr: "Kalyan Nagar", code: "MEM-1012", review: false },
    { name: "Kunal Shah", phone: BigInt("9820110013"), gender: Gender.male, dob: "07-04-1991", doj: "01-08-2026", addr: "Bannerghatta Road", code: "MEM-1013", review: true },
    { name: "Divya Rao", phone: BigInt("9820110014"), gender: Gender.female, dob: "26-10-1994", doj: "10-08-2026", addr: "Richmond Town", code: "MEM-1014", review: true }, // Birthday yesterday!
    { name: "Siddharth Chauhan", phone: BigInt("9820110015"), gender: Gender.male, dob: "25-08-1989", doj: "20-08-2026", addr: "Frazer Town", code: "MEM-1015", review: false },
    { name: "Kavita Pillai", phone: BigInt("9820110016"), gender: Gender.female, dob: "12-01-1996", doj: "01-09-2026", addr: "Malleswaram 8th Cross", code: "MEM-1016", review: true },
    { name: "Varun Bhatia", phone: BigInt("9820110017"), gender: Gender.male, dob: "04-11-1995", doj: "05-09-2026", addr: "Rajajinagar 1st Block", code: "MEM-1017", review: false },
    { name: "Ritu Sen", phone: BigInt("9820110018"), gender: Gender.female, dob: "29-07-1997", doj: "12-09-2026", addr: "Basavanagudi", code: "MEM-1018", review: false },
    { name: "Rajesh Kumar", phone: BigInt("9820110019"), gender: Gender.male, dob: "17-03-1985", doj: "15-09-2026", addr: "Hebbal Lake View", code: "MEM-1019", review: true },
    { name: "Shreya Mukherjee", phone: BigInt("9820110020"), gender: Gender.female, dob: "23-05-1998", doj: "20-09-2026", addr: "Yelahanka New Town", code: "MEM-1020", review: false },
    { name: "Karthik Swaminathan", phone: BigInt("9820110021"), gender: Gender.male, dob: "08-10-1991", doj: "25-09-2026", addr: "Domlur 2nd Stage", code: "MEM-1021", review: true },
    { name: "Simran Kaur", phone: BigInt("9820110022"), gender: Gender.female, dob: "14-02-1996", doj: "28-09-2026", addr: "Ulsoor Road", code: "MEM-1022", review: false },
    { name: "Nikhil Saxena", phone: BigInt("9820110023"), gender: Gender.male, dob: "31-12-1993", doj: "01-10-2026", addr: "MG Road Metro Station", code: "MEM-1023", review: true },
    { name: "Meera Nambiar", phone: BigInt("9820110024"), gender: Gender.female, dob: "06-08-1999", doj: "05-10-2026", addr: "Cunningham Road", code: "MEM-1024", review: false },
    { name: "Ayush Agarwal", phone: BigInt("9820110025"), gender: Gender.male, dob: "19-06-1994", doj: "08-10-2026", addr: "Lavelle Road", code: "MEM-1025", review: true },
    { name: "Ishaan Banerjee", phone: BigInt("9820110026"), gender: Gender.male, dob: "02-04-1992", doj: "10-10-2026", addr: "Sadashivanagar", code: "MEM-1026", review: false },
    { name: "Riya Kapoor", phone: BigInt("9820110027"), gender: Gender.female, dob: "27-09-1997", doj: "12-10-2026", addr: "Vasanth Nagar", code: "MEM-1027", review: true },
    { name: "Manish Tiwari", phone: BigInt("9820110028"), gender: Gender.male, dob: "15-12-1987", doj: "15-10-2026", addr: "Seshadripuram", code: "MEM-1028", review: false },
  ];

  const createdMembers = [];
  for (const m of memberData) {
    const created = await prisma.member.create({
      data: {
        name: m.name,
        email: `${m.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        memberCode: m.code,
        phone: m.phone,
        password: "Test@12345",
        address: m.addr,
        DOB: m.dob,
        DOJ: m.doj,
        gender: m.gender,
        reviewDone: m.review,
      },
    });
    createdMembers.push(created);
  }

  // 3. Sales & Invoices
  const salesPlans = [
    { mIdx: 0, s: sAnnual, start: "15-01-2026", end: "15-01-2027", amount: 14000, paid: 14000, discount: 1000 },
    { mIdx: 4, s: sAnnual, start: "20-04-2026", end: "20-04-2027", amount: 15000, paid: 15000, discount: 0 },
    { mIdx: 8, s: sAnnual, start: "10-06-2026", end: "10-06-2027", amount: 13500, paid: 13500, discount: 1500 },
    { mIdx: 1, s: sHalfYearly, start: "25-04-2026", end: "25-10-2026", amount: 8500, paid: 5000, discount: 0 },
    { mIdx: 6, s: sHalfYearly, start: "20-04-2026", end: "20-10-2026", amount: 8000, paid: 8000, discount: 500 },
    { mIdx: 10, s: sHalfYearly, start: "27-04-2026", end: "27-10-2026", amount: 8500, paid: 8500, discount: 0 },
    { mIdx: 2, s: sQuarterly, start: "01-08-2026", end: "01-11-2026", amount: 4800, paid: 4800, discount: 0 },
    { mIdx: 5, s: sQuarterly, start: "22-07-2026", end: "22-10-2026", amount: 4800, paid: 3000, discount: 0 },
    { mIdx: 7, s: sQuarterly, start: "15-08-2026", end: "15-11-2026", amount: 4500, paid: 4500, discount: 300 },
    { mIdx: 11, s: sQuarterly, start: "01-09-2026", end: "01-12-2026", amount: 4800, paid: 2500, discount: 0 },
    { mIdx: 13, s: sQuarterly, start: "10-08-2026", end: "10-11-2026", amount: 4800, paid: 4800, discount: 0 },
    { mIdx: 3, s: sPT, start: "15-08-2026", end: "15-11-2026", amount: 12000, paid: 12000, discount: 0 },
    { mIdx: 12, s: sPT, start: "01-09-2026", end: "01-12-2026", amount: 11000, paid: 6000, discount: 1000 },
    { mIdx: 16, s: sPT, start: "10-09-2026", end: "10-12-2026", amount: 12000, paid: 12000, discount: 0 },
    { mIdx: 9, s: sZumba, start: "01-10-2026", end: "01-11-2026", amount: 2500, paid: 2500, discount: 0 },
    { mIdx: 15, s: sZumba, start: "21-09-2026", end: "21-10-2026", amount: 2500, paid: 1500, discount: 0 },
    { mIdx: 19, s: sZumba, start: "05-10-2026", end: "05-11-2026", amount: 2500, paid: 2500, discount: 0 },
    { mIdx: 14, s: sCardioCrossfit, start: "20-08-2026", end: "20-11-2026", amount: 5500, paid: 5500, discount: 0 },
    { mIdx: 18, s: sCardioCrossfit, start: "15-09-2026", end: "15-12-2026", amount: 5000, paid: 3000, discount: 500 },
    { mIdx: 17, s: sMonthly, start: "25-09-2026", end: "25-10-2026", amount: 2000, paid: 2000, discount: 0 },
    { mIdx: 20, s: sMonthly, start: "01-10-2026", end: "01-11-2026", amount: 2000, paid: 2000, discount: 0 },
    { mIdx: 21, s: sMonthly, start: "05-10-2026", end: "05-11-2026", amount: 2000, paid: 1000, discount: 0 },
    { mIdx: 22, s: sYoga, start: "01-10-2026", end: "01-11-2026", amount: 2200, paid: 2200, discount: 0 },
    { mIdx: 23, s: sYoga, start: "08-10-2026", end: "08-11-2026", amount: 2200, paid: 2200, discount: 0 },
  ];

  for (const sp of salesPlans) {
    const member = createdMembers[sp.mIdx];
    await prisma.sales.create({
      data: {
        member_id: member.id,
        service_id: sp.s.id,
        description: `${sp.s.name} enrollment for ${member.name}`,
        discount: sp.discount,
        amount: sp.amount,
        paid: sp.paid,
        startDate: sp.start,
        endDate: sp.end,
      },
    });
  }

  // 4. Attendance
  const attendanceTimes = ["06:15:00", "07:00:00", "07:45:00", "08:30:00", "17:30:00", "18:15:00", "19:00:00", "20:00:00"];
  for (let day = 10; day <= 27; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateFormatted = `${dayStr}-10-2026`;
    const attendeesCount = 10 + (day % 6);
    for (let i = 0; i < attendeesCount; i++) {
      const member = createdMembers[(i * 3 + day) % createdMembers.length];
      const time = attendanceTimes[(i + day) % attendanceTimes.length];
      await prisma.attendance.create({
        data: {
          member_id: member.id,
          date: dateFormatted,
          time: time,
        },
      }).catch(() => {});
    }
  }

  // 5. Enquiries
  const enquiries = [
    { name: "Suresh Patil", phone: 9820551101n, type: "walkin" as EnquiryType, fDate: "28-10-2026", msg: "Interested in morning weight loss and cardio batch. Took gym tour." },
    { name: "Deepika Sharma", phone: 9820551102n, type: "call" as EnquiryType, fDate: "28-10-2026", msg: "Enquired about Zumba evening classes and student discount." },
    { name: "Akash Singhania", phone: 9820551103n, type: "instagram" as EnquiryType, fDate: "29-10-2026", msg: "Saw Instagram transformation reel. Wants 1-on-1 PT consultation." },
    { name: "Priyanka Desai", phone: 9820551104n, type: "whatsapp" as EnquiryType, fDate: "30-10-2026", msg: "Asked about couple quarterly membership package." },
    { name: "Harish Pillai", phone: 9820551105n, type: "walkin" as EnquiryType, fDate: "27-10-2026", msg: "Came with existing member Rohan. Scheduled free trial today." },
    { name: "Sunita Yadav", phone: 9820551106n, type: "call" as EnquiryType, fDate: "31-10-2026", msg: "Enquired about postpartum strength training with female trainer." },
    { name: "Varun Bajaj", phone: 9820551107n, type: "instagram" as EnquiryType, fDate: "29-10-2026", msg: "Powerlifting section and Olympic barbell availability enquiry." },
    { name: "Nisha Agarwal", phone: 9820551108n, type: "whatsapp" as EnquiryType, fDate: "28-10-2026", msg: "Diet plan consultation + annual gym membership package." },
    { name: "Abhishek Joshi", phone: 9820551109n, type: "walkin" as EnquiryType, fDate: "27-10-2026", msg: "Corporate group discount for 4 IT colleagues." },
  ];

  for (const enq of enquiries) {
    await prisma.enquiry.create({
      data: {
        name: enq.name,
        phone: enq.phone,
        type: enq.type,
        followupDate: enq.fDate,
        message: enq.msg,
      },
    }).catch(() => {});
  }

  // 6. Fitness Records
  const fitMembers = [createdMembers[0], createdMembers[1], createdMembers[4], createdMembers[6], createdMembers[8]];
  for (const fm of fitMembers) {
    await prisma.fitnessRecord.create({
      data: {
        member_id: fm.id,
        date: "20-10-2026",
        weight: 74,
        height: 176,
        chest: 38,
        abs: 32,
        hips: 36,
        thighs: 22,
        treadmill: 20,
        chestPress: 60,
        latPulldown: 55,
        squats: 80,
        sitAndReach: 15,
      },
    }).catch(() => {});
  }

  // 7. Food Items
  const foods = [
    { name: "Boiled Egg Whites (4 pieces)", calories: 68, protein: 14, carbs: 1, fats: 0, recipe: "Hard boiled eggs, yolk separated, sprinkled with black pepper and pink salt." },
    { name: "Grilled Chicken Breast (150g)", calories: 247, protein: 46, carbs: 0, fats: 5, recipe: "Marinated with lemon, ginger-garlic paste, curd, roasted on skillet." },
    { name: "Low-Fat Paneer Bhurji (100g)", calories: 180, protein: 18, carbs: 6, fats: 10, recipe: "Crumbled low-fat paneer cooked with onion, tomato, turmeric, and green chilies." },
    { name: "Rolled Oats with Whey Protein", calories: 340, protein: 28, carbs: 46, fats: 5, recipe: "Cooked in warm water or almond milk, mixed with 1 scoop whey isolate." },
    { name: "Sprouted Moong & Chana Salad", calories: 160, protein: 12, carbs: 26, fats: 2, recipe: "Sprouted pulses tossed with diced cucumber, tomatoes, lemon juice, and chaat masala." },
    { name: "Soya Chunks Curry (50g dry)", calories: 172, protein: 26, carbs: 16, fats: 1, recipe: "High-protein soya chunks boiled and cooked in light onion-tomato gravy." },
    { name: "Brown Rice with Yellow Dal & Salad", calories: 380, protein: 14, carbs: 70, fats: 4, recipe: "1 cup boiled brown rice with yellow moong dal and freshly cut cucumber." },
    { name: "Peanut Butter & Banana Shake", calories: 310, protein: 12, carbs: 42, fats: 11, recipe: "1 ripe banana blended with 1 tbsp natural peanut butter and cold toned milk." },
  ];

  for (const food of foods) {
    await prisma.foodItems.create({ data: food }).catch(() => {});
  }

  // 8. To-Do Items
  const todos = [
    { title: "Call Suresh Patil and Deepika Sharma for membership follow-up", completed: false },
    { title: "Collect pending balance of ₹3,500 from Rohan Mehta", completed: false },
    { title: "Order replacement cable for Lat Pulldown machine", completed: false },
    { title: "Send Happy Birthday WhatsApp wish to Ananya Iyer", completed: true },
    { title: "Sanitize cardio section and dumbbells before evening shift", completed: true },
    { title: "Schedule weekend body transformation assessment session", completed: false },
  ];

  for (const td of todos) {
    await prisma.toDo.create({ data: td }).catch(() => {});
  }

  return {
    success: true,
    message: "Pitch demo dataset initialized successfully!",
    counts: {
      members: 28,
      services: 8,
      sales: salesPlans.length,
      enquiries: enquiries.length,
      todos: todos.length,
    },
  };
}
