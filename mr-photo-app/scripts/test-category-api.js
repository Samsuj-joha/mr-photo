// scripts/test-category-api.js
// Test the category detection API endpoint through Next.js

const http = require('http');

console.log('🧪 Testing Category Detection API...\n');
console.log('📍 Make sure your Next.js dev server is running on port 3000\n');

// Test with a bird image URL
const testImageUrl = 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400';

const testData = JSON.stringify({
  imageUrl: testImageUrl,
  fileName: 'bird-test.jpg'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/detect-category',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('🔍 Sending test request to: http://localhost:3000/api/ai/detect-category');
console.log(`📸 Test image: ${testImageUrl}\n`);

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ API is working!');
        console.log('\n📋 Results:');
        console.log(`   Category: ${result.category}`);
        console.log(`   Confidence: ${result.confidence || 'N/A'}`);
        console.log(`   Method: ${result.method || 'N/A'}`);
        console.log(`   Reasoning: ${result.reasoning || 'N/A'}`);
        
        if (result.category === 'Birds') {
          console.log('\n🎉 Perfect! Bird image correctly detected as "Birds"');
        } else {
          console.log(`\n⚠️  Expected "Birds" but got "${result.category}"`);
          if (result.method === 'filename_heuristic') {
            console.log('   💡 API key might not be configured or server needs restart');
          }
        }
      } else {
        console.log('❌ API returned error:');
        console.log('   Error:', result.error || result.message);
        console.log('   Details:', result.details || 'No details');
      }
      
      process.exit(0);
    } catch (error) {
      console.log('❌ Failed to parse response:', error.message);
      console.log('\nRaw response:');
      console.log(data);
      
      if (data.includes('ECONNREFUSED') || data.includes('connect')) {
        console.log('\n💡 Server is not running!');
        console.log('   Start your dev server: npm run dev');
      }
      
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
  console.log('\n💡 Make sure your Next.js dev server is running:');
  console.log('   npm run dev');
  process.exit(1);
});

req.write(testData);
req.end();

