# 🔷 Azure Computer Vision API Setup Guide

## ✅ Free Tier Available!

Azure Computer Vision API offers a **FREE tier** with:
- **5,000 transactions per month** 🎉
- **20 transactions per minute**
- Perfect for image categorization!

---

## Step-by-Step Setup

### Step 1: Create Azure Account (Free)
1. Go to: https://azure.microsoft.com/free/
2. Sign up for free Azure account
3. No credit card required for free tier!

### Step 2: Create Computer Vision Resource
1. Go to Azure Portal: https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Computer Vision"**
4. Click **"Create"**

### Step 3: Configure the Resource
Fill in the form:
- **Subscription**: Choose your subscription
- **Resource Group**: Create new or use existing
- **Region**: Choose closest to you (e.g., "East US", "West Europe")
- **Name**: Give it a name (e.g., "mr-photo-vision")
- **Pricing Tier**: Select **"Free F0"** (5,000 transactions/month)
- Click **"Review + create"** then **"Create"**

### Step 4: Get Your API Keys
1. Wait for deployment (1-2 minutes)
2. Click **"Go to resource"**
3. Go to **"Keys and Endpoint"** in left menu
4. Copy:
   - **KEY 1** (or KEY 2 - both work)
   - **Endpoint** (looks like: `https://your-name.cognitiveservices.azure.com`)

### Step 5: Add to Your .env File
Open `mr-photo-app/.env` and add:

```env
# Azure Computer Vision API (Free Tier)
AZURE_COMPUTER_VISION_ENDPOINT=https://your-name.cognitiveservices.azure.com
AZURE_COMPUTER_VISION_KEY=your-key-here
```

**Replace:**
- `your-name` with your actual endpoint
- `your-key-here` with your actual KEY 1

### Step 6: Restart Your Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## How It Works

1. **Upload image** → System calls Azure Computer Vision API
2. **Azure analyzes** → Returns tags (e.g., "bird", "nature", "ocean")
3. **System maps tags** → Converts to your categories (Birds, Animal, Ocean, etc.)
4. **Saves to database** → Image categorized automatically!

---

## Category Mapping

Azure tags are automatically mapped to your categories:

| Azure Detects | Your Category |
|--------------|---------------|
| bird, eagle, owl, etc. | **Birds** |
| dog, cat, lion, etc. | **Animal** |
| ocean, sea, beach, etc. | **Ocean** |
| forest, mountain, tree, etc. | **Nature** |
| peace, calm, serene, etc. | **Peace in Mind** |
| Everything else | **Others** |

---

## Free Tier Limits

- ✅ **5,000 requests/month** - Perfect for small to medium galleries
- ✅ **20 requests/minute** - Good for normal usage
- ✅ **No credit card required** for free tier
- ⚠️ If you exceed, you'll need to upgrade (but 5,000/month is generous!)

---

## Testing

After setup, test with:
```bash
node scripts/test-category-api.js
```

Should show:
- Method: `azure_computer_vision` ✅
- Category detected correctly

---

## Troubleshooting

### "Invalid endpoint" error
- Check endpoint URL format: `https://your-name.cognitiveservices.azure.com`
- Make sure there's no trailing slash

### "Invalid key" error
- Copy the KEY 1 or KEY 2 from Azure portal
- Make sure there are no extra spaces

### "Quota exceeded" error
- You've used all 5,000 free requests this month
- Wait for next month OR upgrade to paid tier

---

## Comparison: Azure vs OpenAI

| Feature | Azure (Free) | OpenAI |
|---------|--------------|--------|
| **Cost** | FREE (5K/month) | ~$0.01-0.03/image |
| **Setup** | Easy | Easy |
| **Accuracy** | Very Good | Excellent |
| **Speed** | Fast | Fast |
| **Best For** | Budget-conscious | Highest accuracy |

---

## Quick Links

- **Azure Portal**: https://portal.azure.com
- **Create Resource**: https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision
- **Pricing**: https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/
- **Documentation**: https://learn.microsoft.com/azure/cognitive-services/computer-vision/

---

**After setup, your images will be automatically categorized using Azure's free tier!** 🎉

