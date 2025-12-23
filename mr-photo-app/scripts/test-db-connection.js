// scripts/test-db-connection.js
// Script to test database connection

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...\n");
    
    // Try to connect
    await prisma.$connect();
    console.log("✅ Successfully connected to database!");
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);
    
    const galleryCount = await prisma.gallery.count();
    console.log(`📁 Galleries in database: ${galleryCount}`);
    
    const imageCount = await prisma.galleryImage.count();
    console.log(`🖼️  Images in database: ${imageCount}`);
    
    const sliderCount = await prisma.homeSlider.count();
    console.log(`🎠 Sliders in database: ${sliderCount}`);
    
    console.log("\n✅ Database connection test successful!");
    
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
    
    if (error.message.includes("does not exist")) {
      console.log("\n💡 The database might not exist. Try:");
      console.log("   1. Create the database manually in Azure Portal");
      console.log("   2. Or use: CREATE DATABASE \"mr-photo\";");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

