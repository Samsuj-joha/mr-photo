// scripts/create-database.js
// Script to create the database if it doesn't exist

const { PrismaClient } = require("@prisma/client");

async function createDatabase() {
  try {
    console.log("🔍 Checking database connection...\n");
    
    // Try to connect to the default postgres database first
    const postgresUrl = process.env.DATABASE_URL?.replace(/\/mr-photo\?/, "/postgres?");
    
    if (!postgresUrl) {
      console.error("❌ DATABASE_URL not found in environment variables");
      return;
    }
    
    console.log("📝 Original DATABASE_URL:", process.env.DATABASE_URL);
    console.log("📝 Postgres DATABASE_URL:", postgresUrl);
    
    // Create a Prisma client for the postgres database
    const postgresClient = new PrismaClient({
      datasources: {
        db: {
          url: postgresUrl
        }
      }
    });
    
    try {
      // Try to connect to postgres database
      await postgresClient.$connect();
      console.log("✅ Connected to postgres database");
      
      // Check if mr-photo database exists
      const result = await postgresClient.$queryRaw`
        SELECT datname FROM pg_database WHERE datname = 'mr-photo';
      `;
      
      if (Array.isArray(result) && result.length > 0) {
        console.log("✅ Database 'mr-photo' already exists!");
      } else {
        console.log("📦 Creating database 'mr-photo'...");
        // Create the database
        await postgresClient.$executeRawUnsafe(`CREATE DATABASE "mr-photo";`);
        console.log("✅ Database 'mr-photo' created successfully!");
      }
      
      await postgresClient.$disconnect();
    } catch (error) {
      console.error("❌ Error:", error.message);
      
      // Try direct connection to mr-photo
      console.log("\n🔄 Trying direct connection to mr-photo database...");
      const db = new PrismaClient();
      
      try {
        await db.$connect();
        console.log("✅ Direct connection to mr-photo works!");
        await db.$disconnect();
      } catch (err) {
        console.error("❌ Direct connection failed:", err.message);
        console.log("\n💡 You may need to create the database manually in Azure Portal:");
        console.log("   1. Go to Azure Portal");
        console.log("   2. Navigate to your PostgreSQL server");
        console.log("   3. Create a new database named 'mr-photo'");
      }
    }
    
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

createDatabase();




