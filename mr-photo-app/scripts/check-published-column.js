// scripts/check-published-column.js
// Script to check if published column exists

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkColumn() {
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'GalleryImage' 
      AND column_name = 'published';
    `;

    console.log("Column check result:", JSON.stringify(result, null, 2));

    if (Array.isArray(result) && result.length > 0) {
      console.log("✅ Published column EXISTS");
    } else {
      console.log("❌ Published column DOES NOT EXIST");
    }
  } catch (error) {
    console.error("❌ Error checking column:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkColumn();
