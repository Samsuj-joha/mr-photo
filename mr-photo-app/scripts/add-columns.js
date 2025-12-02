// scripts/add-columns.js
// Script to add year and category columns to GalleryImage table

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/migrate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('🔧 Running database migration...');
console.log('📍 Connecting to: http://localhost:3000/api/admin/migrate');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ Migration completed successfully!');
        console.log('📋 Results:');
        result.results.forEach((r, i) => {
          console.log(`   ${i + 1}. ${r}`);
        });
        console.log('\n🎉 You can now upload images with year and category fields!');
        process.exit(0);
      } else {
        console.error('❌ Migration failed:', result.message);
        console.error('Details:', result.details);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.error('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.error('\n💡 Make sure your Next.js dev server is running on port 3000');
  console.error('   Run: npm run dev');
  process.exit(1);
});

req.end();

