// scripts/publish-all-images.js
// Script to publish all unpublished images

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function publishAllImages() {
  try {
    console.log("🔄 Publishing all unpublished images...\n");

    // Count unpublished images
    const unpublishedCount = await prisma.galleryImage.count({
      where: { published: false }
    });

    console.log(`📊 Found ${unpublishedCount} unpublished images`);

    if (unpublishedCount === 0) {
      console.log("✅ All images are already published!");
      return;
    }

    // Publish all unpublished images
    const result = await prisma.galleryImage.updateMany({
      where: { published: false },
      data: { published: true }
    });

    console.log(`✅ Published ${result.count} images successfully!`);
    console.log("\n🔄 Refresh your gallery page to see the images.");

  } catch (error) {
    console.error("❌ Error publishing images:", error);
  } finally {
    await prisma.$disconnect();
  }
}

publishAllImages();

