// scripts/backfill-years.ts
// This script updates all existing gallery images to have a year value based on their createdAt date

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting to backfill year values for gallery images...')
  
  // Get all images without a year
  const images = await prisma.galleryImage.findMany({
    where: {
      year: null
    },
    select: {
      id: true,
      createdAt: true
    }
  })

  console.log(`Found ${images.length} images without year values`)

  let updated = 0
  for (const image of images) {
    const year = image.createdAt.getFullYear()
    await prisma.galleryImage.update({
      where: { id: image.id },
      data: { year }
    })
    updated++
    if (updated % 10 === 0) {
      console.log(`Updated ${updated}/${images.length} images...`)
    }
  }

  console.log(`✅ Successfully updated ${updated} images with year values!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

