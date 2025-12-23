// scripts/test-homeSlider.js
// Test HomeSlider table access

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testHomeSlider() {
  try {
    console.log("🔍 Testing HomeSlider table access...\n");
    
    // Try to query HomeSlider
    const sliders = await prisma.homeSlider.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    });
    
    console.log(`✅ Successfully queried HomeSlider table!`);
    console.log(`📊 Found ${sliders.length} active sliders`);
    
    if (sliders.length > 0) {
      console.log("\n📸 Sample slider:");
      console.log(`   ID: ${sliders[0].id}`);
      console.log(`   Title: ${sliders[0].title || "N/A"}`);
      console.log(`   Image URL: ${sliders[0].imageUrl.substring(0, 60)}...`);
    }
    
  } catch (error) {
    console.error("❌ Error querying HomeSlider:");
    console.error(error.message);
    
    if (error.message.includes("does not exist")) {
      console.log("\n💡 The table exists but Prisma can't see it.");
      console.log("   This might be a schema/connection issue.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testHomeSlider();

