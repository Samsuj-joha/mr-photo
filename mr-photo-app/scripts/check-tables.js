// scripts/check-tables.js
// Script to check what tables exist in the database

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log("🔍 Checking tables in database...\n");
    
    // Query to get all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log("📊 Tables in database:");
    if (Array.isArray(tables) && tables.length > 0) {
      tables.forEach((table, idx) => {
        console.log(`   ${idx + 1}. ${table.table_name}`);
      });
    } else {
      console.log("   ❌ No tables found!");
    }
    
    // Check specific tables that should exist
    const requiredTables = [
      'HomeSlider',
      'Gallery',
      'GalleryImage',
      'User',
      'Account',
      'Session',
      'Portfolio',
      'Blog',
      'Contact',
      'About',
      'Book',
      'BookTag',
      'Feature',
      'Settings'
    ];
    
    console.log("\n🔍 Checking required tables:");
    const existingTableNames = tables.map(t => t.table_name);
    
    requiredTables.forEach(tableName => {
      const exists = existingTableNames.includes(tableName);
      const status = exists ? "✅" : "❌";
      console.log(`   ${status} ${tableName}`);
    });
    
    const missingTables = requiredTables.filter(t => !existingTableNames.includes(t));
    if (missingTables.length > 0) {
      console.log(`\n⚠️  Missing ${missingTables.length} tables: ${missingTables.join(", ")}`);
      console.log("\n💡 Running migrations to create missing tables...");
    } else {
      console.log("\n✅ All required tables exist!");
    }
    
  } catch (error) {
    console.error("❌ Error checking tables:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();

