import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function reset() {
  console.log("🧹 Wiping all tables in gym_demo_db...");
  await prisma.attendance.deleteMany();
  await prisma.fitnessRecord.deleteMany();
  await prisma.sales.deleteMany();
  await prisma.member.deleteMany();
  await prisma.services.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.toDo.deleteMany();
  await prisma.foodItems.deleteMany();
  await prisma.exercise.deleteMany();
  console.log("✨ Database gym_demo_db is now completely empty and ready for production or re-seeding!");
}

reset()
  .catch((e) => {
    console.error("Error resetting database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
