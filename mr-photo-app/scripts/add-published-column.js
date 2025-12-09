// scripts/add-published-column.js
// Script to add published column to GalleryImage table

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addPublishedColumn() {
  try {
    console.log("🔧 Adding published column to GalleryImage table...");

    // Check if column exists
    const checkColumn = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'GalleryImage' 
      AND column_name = 'published';
    `;

    if (Array.isArray(checkColumn) && checkColumn.length > 0) {
      console.log("✅ Published column already exists");
      return;
    }

    // Add the column
    await prisma.$executeRaw`
      ALTER TABLE "GalleryImage" 
      ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;
    `;

    console.log("✅ Published column added successfully");
  } catch (error) {
    console.error("❌ Error adding published column:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addPublishedColumn()
  .then(() => {
    console.log("✅ Migration completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
