// scripts/seed-database.js
// Script to seed the database with sample images for testing

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Sample Home Slider Images (using Unsplash placeholder images)
    const sliderImages = [
      {
        title: "Beautiful Landscape",
        description: "Stunning natural scenery",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
        publicId: "seed-slider-1",
        alt: "Beautiful landscape photography",
        order: 0,
        active: true,
      },
      {
        title: "Mountain View",
        description: "Majestic mountain ranges",
        imageUrl: "https://images.unsplash.com/photo-1464822759844-d150ad2796bf?w=1920&h=1080&fit=crop",
        publicId: "seed-slider-2",
        alt: "Mountain view photography",
        order: 1,
        active: true,
      },
      {
        title: "Ocean Sunset",
        description: "Peaceful ocean sunset",
        imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop",
        publicId: "seed-slider-3",
        alt: "Ocean sunset photography",
        order: 2,
        active: true,
      },
    ];

    console.log("📸 Adding Home Slider images...");
    for (const image of sliderImages) {
      try {
        await prisma.homeSlider.create({ data: image });
        console.log(`  ✅ Added: ${image.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  Skipped (already exists): ${image.title}`);
        } else {
          throw error;
        }
      }
    }

    // Create a sample Gallery
    console.log("\n📁 Creating sample Gallery...");
    let gallery;
    try {
      gallery = await prisma.gallery.create({
        data: {
          title: "Nature Photography",
          description: "A collection of beautiful nature photographs",
          category: "Nature",
          country: "Bangladesh",
          featured: true,
          published: true,
        },
      });
      console.log(`  ✅ Created gallery: ${gallery.title}`);
    } catch (error) {
      if (error.code === 'P2002') {
        gallery = await prisma.gallery.findFirst({
          where: { title: "Nature Photography" },
        });
        console.log(`  ⚠️  Gallery already exists, using existing one`);
      } else {
        throw error;
      }
    }

    // Add Gallery Images
    const galleryImages = [
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
        publicId: "seed-gallery-1",
        alt: "Forest path",
        caption: "A peaceful forest path",
        order: 0,
        year: 2024,
        category: "Nature",
        published: true,
        galleryId: gallery.id,
      },
      {
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop",
        publicId: "seed-gallery-2",
        alt: "Mountain landscape",
        caption: "Beautiful mountain landscape",
        order: 1,
        year: 2024,
        category: "Nature",
        published: true,
        galleryId: gallery.id,
      },
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
        publicId: "seed-gallery-3",
        alt: "Lake view",
        caption: "Serene lake view",
        order: 2,
        year: 2024,
        category: "Nature",
        published: true,
        galleryId: gallery.id,
      },
    ];

    console.log("\n🖼️  Adding Gallery images...");
    for (const image of galleryImages) {
      try {
        await prisma.galleryImage.create({ data: image });
        console.log(`  ✅ Added: ${image.alt}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  Skipped (already exists): ${image.alt}`);
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }

    // Create sample Features
    console.log("\n⭐ Adding Features...");
    const features = [
      {
        title: "Professional Photography",
        description: "High-quality professional photography services for all your needs.",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
        publicId: "seed-feature-1",
        icon: "camera",
        published: true,
        featured: true,
        order: 0,
      },
      {
        title: "Creative Editing",
        description: "Expert photo editing and post-processing to bring your images to life.",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop",
        publicId: "seed-feature-2",
        icon: "palette",
        published: true,
        featured: true,
        order: 1,
      },
      {
        title: "Portrait Sessions",
        description: "Beautiful portrait photography sessions for individuals and families.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
        publicId: "seed-feature-3",
        icon: "user",
        published: true,
        featured: true,
        order: 2,
      },
    ];

    for (const feature of features) {
      try {
        await prisma.feature.create({ data: feature });
        console.log(`  ✅ Added: ${feature.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  Skipped (already exists): ${feature.title}`);
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }

    // Create a sample Portfolio
    console.log("\n💼 Adding Portfolio items...");
    const portfolios = [
      {
        title: "Wedding Photography",
        description: "Beautiful wedding photography collection",
        category: "Wedding",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop",
        ],
        featured: true,
        published: true,
      },
    ];

    for (const portfolio of portfolios) {
      try {
        await prisma.portfolio.create({ data: portfolio });
        console.log(`  ✅ Added: ${portfolio.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  Skipped (already exists): ${portfolio.title}`);
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    const sliderCount = await prisma.homeSlider.count();
    const galleryCount = await prisma.gallery.count();
    const imageCount = await prisma.galleryImage.count();
    const featureCount = await prisma.feature.count();
    const portfolioCount = await prisma.portfolio.count();

    console.log(`  🎠 Home Slider images: ${sliderCount}`);
    console.log(`  📁 Galleries: ${galleryCount}`);
    console.log(`  🖼️  Gallery Images: ${imageCount}`);
    console.log(`  ⭐ Features: ${featureCount}`);
    console.log(`  💼 Portfolios: ${portfolioCount}`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase()
  .then(() => {
    console.log("\n🎉 Seeding process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding process failed:", error);
    process.exit(1);
  });

