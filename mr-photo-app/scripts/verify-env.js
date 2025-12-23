// scripts/verify-env.js
// Script to verify environment variables are loaded correctly

// Read .env file manually
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse DATABASE_URL from .env file
const dbUrlMatch = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1] : null;

console.log("🔍 Verifying environment variables...\n");

if (!dbUrl) {
  console.error("❌ DATABASE_URL is not set!");
  process.exit(1);
}

console.log("✅ DATABASE_URL is set");
console.log("📝 Database URL (masked):", dbUrl.replace(/:[^:@]+@/, ':****@'));

// Parse the URL
try {
  const url = new URL(dbUrl);
  console.log("\n📊 Parsed DATABASE_URL:");
  console.log("   Protocol:", url.protocol);
  console.log("   Host:", url.hostname);
  console.log("   Port:", url.port);
  console.log("   Database:", url.pathname.replace('/', ''));
  console.log("   SSL Mode:", url.searchParams.get('sslmode') || 'not specified');
  
  // Check if database name is in the path
  const dbName = url.pathname.replace('/', '').split('?')[0];
  if (dbName === 'mr-photo') {
    console.log("\n✅ Database name 'mr-photo' is correct in connection string");
  } else {
    console.log(`\n⚠️  Database name in connection string is '${dbName}', expected 'mr-photo'`);
  }
} catch (error) {
  console.error("❌ Error parsing DATABASE_URL:", error.message);
}

console.log("\n✅ Environment verification complete");

