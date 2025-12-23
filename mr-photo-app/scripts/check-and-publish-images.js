// scripts/check-and-publish-images.js
// Script to check images in database and publish them if needed

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAndPublishImages() {
  try {
    console.log("🔍 Checking images in database...\n");

    // Check total images
    const totalImages = await prisma.galleryImage.count();
    console.log(`📊 Total images in database: ${totalImages}`);

    // Check published images
    const publishedImages = await prisma.galleryImage.count({
      where: { published: true }
    });
    console.log(`✅ Published images: ${publishedImages}`);

    // Check unpublished images
    const unpublishedImages = await prisma.galleryImage.count({
      where: { published: false }
    });
    console.log(`❌ Unpublished images: ${unpublishedImages}`);

    // Check galleries
    const totalGalleries = await prisma.gallery.count();
    const publishedGalleries = await prisma.gallery.count({
      where: { published: true }
    });
    console.log(`\n📁 Total galleries: ${totalGalleries}`);
    console.log(`✅ Published galleries: ${publishedGalleries}`);

    // Check images with published galleries
    const imagesWithPublishedGalleries = await prisma.galleryImage.findMany({
      where: {
        gallery: { published: true }
      },
      include: {
        gallery: true
      }
    });

    console.log(`\n🖼️ Images in published galleries: ${imagesWithPublishedGalleries.length}`);

    // Show sample images
    if (imagesWithPublishedGalleries.length > 0) {
      console.log("\n📸 Sample images:");
      imagesWithPublishedGalleries.slice(0, 5).forEach((img, idx) => {
        console.log(`  ${idx + 1}. ID: ${img.id}`);
        console.log(`     URL: ${img.url.substring(0, 60)}...`);
        console.log(`     Published: ${img.published}`);
        console.log(`     Gallery: ${img.gallery.title} (Published: ${img.gallery.published})`);
        console.log("");
      });
    }

    // Ask if user wants to publish all unpublished images
    if (unpublishedImages > 0) {
      console.log(`\n⚠️  Found ${unpublishedImages} unpublished images.`);
      console.log("💡 To publish all unpublished images, run:");
      console.log("   node scripts/publish-all-images.js");
    }

    // Check if there are any images that should be visible
    const visibleImages = await prisma.galleryImage.findMany({
      where: {
        published: true,
        gallery: { published: true }
      }
    });

    console.log(`\n👁️  Images visible on public gallery: ${visibleImages.length}`);

    if (visibleImages.length === 0 && totalImages > 0) {
      console.log("\n⚠️  WARNING: You have images but none are published!");
      console.log("   This is why you don't see any images on the gallery page.");
    }

  } catch (error) {
    console.error("❌ Error checking images:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndPublishImages();

