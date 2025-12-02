// scripts/backfill-categories.js
// Script to add categories to existing images that have NULL category

const http = require('http');

console.log('🔧 Backfilling categories for existing images...');
console.log('📍 This will update images with NULL category to have proper categories based on AI detection\n');

// First, check how many images need updating
const checkOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/gallery/backfill-categories?dryRun=true',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('🔍 Step 1: Checking how many images need category updates...');

const checkReq = http.request(checkOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log(`✅ Found ${result.count} images without categories`);
        
        if (result.count === 0) {
          console.log('🎉 All images already have categories!');
          process.exit(0);
        }
        
        console.log('\n🚀 Step 2: Running category detection and update...');
        console.log('⏳ This may take a while depending on the number of images...\n');
        
        // Now run the actual backfill
        const backfillOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/admin/gallery/backfill-categories',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        const backfillReq = http.request(backfillOptions, (res) => {
          let backfillData = '';

          res.on('data', (chunk) => {
            backfillData += chunk;
          });

          res.on('end', () => {
            try {
              const backfillResult = JSON.parse(backfillData);
              
              if (backfillResult.success) {
                console.log('✅ Backfill completed successfully!');
                console.log(`📊 Updated ${backfillResult.updated} images`);
                
                if (backfillResult.details && backfillResult.details.length > 0) {
                  console.log('\n📋 Category distribution:');
                  const categoryCount = {};
                  backfillResult.details.forEach(d => {
                    categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
                  });
                  Object.entries(categoryCount).forEach(([cat, count]) => {
                    console.log(`   ${cat}: ${count} images`);
                  });
                }
                
                console.log('\n🎉 All done! Your images now have categories.');
                process.exit(0);
              } else {
                console.error('❌ Backfill failed:', backfillResult.message);
                process.exit(1);
              }
            } catch (error) {
              console.error('❌ Failed to parse backfill response:', error.message);
              console.error('Raw response:', backfillData);
              process.exit(1);
            }
          });
        });

        backfillReq.on('error', (error) => {
          console.error('❌ Connection error during backfill:', error.message);
          process.exit(1);
        });

        backfillReq.end();
        
      } else {
        console.error('❌ Check failed:', result.message);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Failed to parse check response:', error.message);
      console.error('Raw response:', data);
      process.exit(1);
    }
  });
});

checkReq.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.error('\n💡 Make sure your Next.js dev server is running on port 3000');
  console.error('   Run: npm run dev');
  process.exit(1);
});

checkReq.end();

