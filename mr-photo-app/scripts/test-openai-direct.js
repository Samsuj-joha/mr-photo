// scripts/test-openai-direct.js
// Test OpenAI API directly with HTTPS

const https = require('https');
const fs = require('fs');

console.log('🧪 Testing OpenAI API Directly (HTTPS)...\n');

// Read API key from .env
const envContent = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = envContent.match(/OPENAI_API_KEY=(.+)/);

if (!apiKeyMatch) {
  console.log('❌ OPENAI_API_KEY not found in .env');
  process.exit(1);
}

const apiKey = apiKeyMatch[1].trim();
console.log('✅ API Key loaded from .env\n');

// Test with a clear bird image
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
            url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400"
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

console.log('🔍 Calling OpenAI API...\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`📊 Status Code: ${res.statusCode}\n`);
    
    if (res.statusCode === 200) {
      try {
        const result = JSON.parse(data);
        const content = result.choices[0]?.message?.content;
        
        console.log('✅ OpenAI API Response Received!\n');
        console.log('📋 Raw Response:');
        console.log(content);
        console.log('\n');
        
        // Try to parse JSON
        try {
          const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : content;
          const categoryData = JSON.parse(jsonString.trim());
          
          console.log('🎯 Parsed Category Data:');
          console.log(`   Category: ${categoryData.category}`);
          console.log(`   Confidence: ${categoryData.confidence}`);
          console.log(`   Reasoning: ${categoryData.reasoning}`);
          
          if (categoryData.category === 'Birds') {
            console.log('\n✅ SUCCESS! Bird image correctly detected!');
          } else {
            console.log(`\n⚠️  Got "${categoryData.category}" instead of "Birds"`);
          }
        } catch (parseError) {
          console.log('⚠️  Could not parse JSON from response');
          console.log('   Error:', parseError.message);
          console.log('   This might be why images go to "Others"');
        }
        
      } catch (error) {
        console.log('❌ Failed to parse response:', error.message);
        console.log('Raw data:', data.substring(0, 500));
      }
    } else {
      console.log('❌ OpenAI API Error:');
      try {
        const errorData = JSON.parse(data);
        console.log('   Type:', errorData.error?.type);
        console.log('   Code:', errorData.error?.code);
        console.log('   Message:', errorData.error?.message);
        
        if (res.statusCode === 401) {
          console.log('\n💡 API Key is invalid or expired');
          console.log('   Check your OpenAI account and regenerate the key');
        } else if (res.statusCode === 429) {
          console.log('\n💡 Rate limit exceeded');
        } else if (res.statusCode === 403) {
          console.log('\n💡 Access forbidden - check API key permissions');
        }
      } catch (e) {
        console.log('Raw error:', data);
      }
    }
    
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
});

req.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
  process.exit(1);
});

req.write(testData);
req.end();

