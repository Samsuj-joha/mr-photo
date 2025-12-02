// scripts/test-openai-api.js
// Test OpenAI API key and category detection

const http = require('http');

console.log('🧪 Testing OpenAI API Configuration...\n');

// Test 1: Check if API key is in .env
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = envContent.match(/OPENAI_API_KEY=(.+)/);

if (!apiKeyMatch) {
  console.log('❌ OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

const apiKey = apiKeyMatch[1].trim();
console.log('✅ API Key found in .env');
console.log(`   Key starts with: ${apiKey.substring(0, 15)}...\n`);

// Test 2: Test OpenAI API directly
console.log('🔍 Testing OpenAI API connection...');

const testImageUrl = 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400'; // Sample bird image

const testData = JSON.stringify({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: `You are an expert photography categorizer. Analyze images and categorize them into ONE of these fixed categories: Birds, Animal, Ocean, Nature, Peace in Mind, Others.

Categories:
- "Birds": Images containing birds, bird photography, avian subjects
- "Animal": Images containing animals (mammals, reptiles, insects, etc.) - but NOT birds
- "Ocean": Images of ocean, sea, water bodies, marine scenes, beaches, waves
- "Nature": Images of natural landscapes, forests, mountains, plants, trees, natural scenery (but NOT ocean/water bodies)
- "Peace in Mind": Images that evoke tranquility, peace, meditation, calmness, serene scenes, spiritual or contemplative imagery
- "Others": Any image that doesn't fit the above categories

Return your response as JSON with this structure:
{
  "category": "one of the exact category names from the list",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}

IMPORTANT: Return the category name EXACTLY as shown in the list (case-sensitive).`
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyze this image and suggest the best photography category."
        },
        {
          type: "image_url",
          image_url: {
            url: testImageUrl
          }
        }
      ]
    }
  ],
  max_tokens: 200,
  temperature: 0.3
});

const options = {
  hostname: 'api.openai.com',
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const result = JSON.parse(data);
        const content = result.choices[0]?.message?.content;
        
        console.log('✅ OpenAI API is working!');
        console.log('\n📋 Response:');
        console.log(content);
        
        // Try to parse category
        try {
          const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : content;
          const categoryData = JSON.parse(jsonString.trim());
          console.log('\n🎯 Detected Category:', categoryData.category);
          console.log('   Confidence:', categoryData.confidence);
          console.log('   Reasoning:', categoryData.reasoning);
        } catch (e) {
          console.log('\n⚠️  Could not parse JSON, but API is responding');
        }
        
        process.exit(0);
      } catch (error) {
        console.log('❌ Failed to parse response:', error.message);
        console.log('Raw response:', data.substring(0, 500));
        process.exit(1);
      }
    } else {
      console.log(`❌ OpenAI API returned error: ${res.statusCode}`);
      console.log('Response:', data);
      
      if (res.statusCode === 401) {
        console.log('\n💡 This usually means:');
        console.log('   - API key is invalid or expired');
        console.log('   - API key doesn\'t have proper permissions');
        console.log('   - Check your OpenAI account billing/credits');
      } else if (res.statusCode === 429) {
        console.log('\n💡 Rate limit exceeded - you may need to wait or upgrade plan');
      }
      
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
  console.log('\n💡 Check your internet connection');
  process.exit(1);
});

req.write(testData);
req.end();

