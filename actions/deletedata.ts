import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteAllCuePoints() {
  try {
    await prisma.cuePoint.deleteMany();
    console.log('All CuePoints deleted successfully');
  } catch (error) {
    console.error('Error deleting CuePoints:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllCuePoints();
