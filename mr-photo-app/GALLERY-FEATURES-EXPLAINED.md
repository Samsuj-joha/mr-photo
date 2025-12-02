# 📸 Gallery Features Explained

## Questions & Answers

### 1. ✅ **AI Integration - YES!**

The system uses **OpenAI GPT-4 Vision API** to automatically detect and categorize uploaded images.

**Location:** `src/app/api/ai/detect-category/route.ts` and `src/app/api/upload/route.ts` (line ~821)

**How it works:**
1. When you upload an image, it's first uploaded to Cloudinary
2. The system calls OpenAI Vision API with the image URL
3. AI analyzes the image and suggests a category from:
   - **Birds**: Bird photography, avian subjects
   - **Animal**: Mammals, reptiles, insects (not birds)
   - **Ocean**: Sea, water, beaches, marine life
   - **Nature**: Landscapes, forests, mountains, plants
   - **Peace in Mind**: Tranquil, meditative, serene scenes
   - **Others**: Everything else

4. If AI detection fails, it falls back to filename-based detection
5. The category is saved to the database with the image

**Current Status:**
```
📊 Your images: 4 total
   Others: 4 images
```

**Why "Others"?**
- AI detection may need OpenAI API key configured
- Images might not clearly fit into the defined categories
- Filename-based fallback defaulted to "Others"

---

### 2. 🖼️ **Title Display on Images**

**Current Behavior:**
- Title shows on **hover** at bottom-left of image
- Love button shows on **hover** at bottom-right
- Both appear with smooth animation when you mouse over

**Options:**

#### Option A: Always Show Title (No Hover)
```tsx
// In GalleryGrid.tsx, remove opacity-0 and hover classes
<div className="absolute bottom-3 left-3 transition-all duration-300">
```

#### Option B: Show Only Love Count (Current)
```tsx
// Keep as is - title on hover, love always visible in button
```

#### Option C: Title Always Visible, Love on Hover Only
```tsx
// Title: Remove opacity-0
// Love: Keep opacity-0 group-hover:opacity-100
```

**Recommendation:** Current design (Option B) is cleanest - images are uncluttered, details appear on interaction.

---

### 3. 🏷️ **Category Display - Why Only "Others"?**

**Diagnosis:**
All 4 images in your database are categorized as "Others".

**Possible Reasons:**
1. **OpenAI API Key Missing**: AI detection requires `OPENAI_API_KEY` in `.env`
2. **Filename-based Fallback**: Images like "DSC03838" don't contain category keywords
3. **Images Added Before Migration**: Images uploaded before category column was added

**Solution:**

#### Check OpenAI API Key:
```bash
# In your .env file, add:
OPENAI_API_KEY=sk-...your-key...
```

#### Re-categorize Existing Images:
```bash
# Option 1: Automatic (requires OpenAI key)
node scripts/backfill-categories.js

# Option 2: Manual via Database
# Update categories in admin panel or database directly
```

#### For New Uploads:
- Rename files with category keywords:
  - `eagle-sunset.jpg` → Auto-detects as "Birds"
  - `ocean-wave.jpg` → Auto-detects as "Ocean"
  - `forest-path.jpg` → Auto-detects as "Nature"
- Or let AI detect (if OpenAI key is configured)

---

### 4. 📁 **Admin Upload Behavior**

**Question:** "Why is it putting all images into a single file?"

**Answer:** This is **by design** - not a bug!

**How Admin Gallery Upload Works:**

1. Navigate to **Admin → Galleries**
2. Click on a **specific gallery** (e.g., "Wildlife 2024")
3. Click "Upload Images" button
4. Select multiple images
5. **All images are uploaded to THAT gallery**

**This is correct because:**
- Galleries are organizational containers (like albums)
- One gallery can have many images
- Example structure:
  ```
  Gallery: "Wildlife 2024"
    ├── Image: Eagle in flight
    ├── Image: Tiger portrait
    └── Image: Deer in forest
  
  Gallery: "Ocean Scenes"
    ├── Image: Sunset beach
    ├── Image: Coral reef
    └── Image: Lighthouse
  ```

**To Upload to Different Galleries:**
1. Create multiple galleries first
2. Go into each gallery separately
3. Upload images to each one

**Alternative Upload Page:**
- `Admin → Gallery Upload` (`/admin/gallery/upload`)
- This page lets you choose gallery for each image

---

## Category Management

### Check Current Categories:
```bash
node scripts/check-categories-api.js
```

### Backfill Missing Categories:
```bash
node scripts/backfill-categories.js
```

### View Categories on Frontend:
Visit `/gallery` - images are grouped by category with section headers.

---

## AI Configuration

### Required Environment Variable:
```env
# .env file
OPENAI_API_KEY=sk-proj-...your-key...
```

### Test AI Detection:
```bash
# Upload a new image with clear content
# Check server logs for:
🤖 Detecting category for image...
✅ AI detected category: [category name]
```

### Fallback Detection:
If AI fails, system uses filename keywords:
- Files with "bird", "eagle", "owl" → "Birds"
- Files with "ocean", "sea", "beach" → "Ocean"
- Files with "tree", "forest", "mountain" → "Nature"
- Files with "peace", "calm", "zen" → "Peace in Mind"
- Everything else → "Others"

---

## Image Display Features

### Gallery Grid (`/gallery`):
- ✅ Masonry layout (Pinterest-style)
- ✅ Grouped by category
- ✅ Hover effects (title + love button)
- ✅ Click to open lightbox modal
- ✅ Filter by year
- ✅ Pagination

### Image Modal (Lightbox):
- ✅ Full-screen image viewer
- ✅ Navigation (prev/next)
- ✅ Image info (title, category, country, loves)
- ✅ Keyboard controls (← →, Esc)
- ✅ Thumbnail strip at bottom
- ✅ Auto-play slideshow

### Admin Panel (`/admin/gallery/[id]`):
- ✅ Drag & drop upload
- ✅ Multiple file selection
- ✅ Progress tracking
- ✅ Year badge display
- ✅ Delete functionality
- ✅ Gallery-specific uploads

---

## Quick Commands

```bash
# Check database schema
npx prisma studio

# Check categories
node scripts/check-categories-api.js

# Add missing columns
node scripts/add-columns.js

# Backfill categories
node scripts/backfill-categories.js

# View migration status
cat MIGRATION-COMPLETE.md
```

---

## Support & Troubleshooting

### Images Not Categorizing:
1. Add `OPENAI_API_KEY` to `.env`
2. Restart dev server
3. Upload new image to test
4. Check server console for AI detection logs

### Want to Change Category Display:
Edit `src/components/gallery/GalleryGrid.tsx`:
- Line 39: `CATEGORY_ORDER` - Change order
- Line 111-122: Category header section
- Line 184-203: Image info overlay

### Want to Change Title Visibility:
Edit `src/components/gallery/GalleryGrid.tsx`:
- Line 184: Remove `opacity-0 group-hover:opacity-100` to always show title

---

**Last Updated:** 2025-11-21  
**Your Current Setup:**
- 📊 Total Images: 4
- 🏷️ Categories: All "Others" (needs AI key or manual categorization)
- ✅ Year/Category columns: Added
- 🤖 AI Detection: Configured but needs OpenAI API key

