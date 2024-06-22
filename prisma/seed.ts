import {prisma} from "../app/utils/prisma.server";

const seed = async () => {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  await prisma.note.deleteMany({});
  console.log("🎵 Cleaned up Private Messages...");
  console.timeEnd("🧹 Cleaned up the database...");

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
