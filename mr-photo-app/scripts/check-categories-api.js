// scripts/check-categories-api.js
// Check image categories via API

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/gallery/check-categories',
  method: 'GET'
};

console.log('🔍 Checking image categories in database...\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log(`📊 Total images: ${result.total}\n`);
        
        console.log('📋 Category distribution:');
        Object.entries(result.categories)
          .sort((a, b) => b[1] - a[1])
          .forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} images`);
          });
        
        console.log('\n🖼️  Sample images:');
        Object.entries(result.samples).forEach(([cat, sample]) => {
          console.log(`   [${cat}] ${sample.alt || sample.publicId}`);
        });
        
        // Analysis
        console.log('\n📈 Analysis:');
        const hasOthers = result.categories['Others'] > 0;
        const hasNulls = result.categories['NULL'] > 0;
        const hasValidCategories = Object.keys(result.categories)
          .filter(cat => cat !== 'NULL' && cat !== 'Others').length > 0;
        
        if (hasNulls) {
          console.log(`   ⚠️  ${result.categories['NULL']} images have NULL category`);
          console.log('   💡 Run: node scripts/backfill-categories.js');
        }
        
        if (hasOthers && result.categories['Others'] === result.total) {
          console.log('   ⚠️  All images are categorized as "Others"');
          console.log('   💡 AI category detection may not be working properly');
        } else if (hasValidCategories) {
          console.log('   ✅ Images are properly categorized!');
        }
        
        process.exit(0);
      } else {
        console.error('❌ Check failed:', result.message);
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
  process.exit(1);
});

req.end();

