// // // src/app/api/upload/route.ts - UPDATED for Admin Form Integration
// // import { NextRequest, NextResponse } from "next/server"
// // import { getServerSession } from "next-auth"
// // import { authOptions } from "@/lib/auth"
// // import { db } from "@/lib/db"

// // export async function POST(request: NextRequest) {
// //   console.log("🚀 Upload API called")
  
// //   try {
// //     // Step 1: Check environment variables first
// //     console.log("🔧 Checking environment variables...")
// //     const cloudName = process.env.CLOUDINARY_CLOUD_NAME
// //     const apiKey = process.env.CLOUDINARY_API_KEY
// //     const apiSecret = process.env.CLOUDINARY_API_SECRET
    
// //     console.log("Environment check:", {
// //       cloudName: cloudName ? "✅ Set" : "❌ Missing",
// //       apiKey: apiKey ? "✅ Set" : "❌ Missing", 
// //       apiSecret: apiSecret ? "✅ Set" : "❌ Missing"
// //     })
    
// //     if (!cloudName || !apiKey || !apiSecret) {
// //       console.log("❌ Missing Cloudinary environment variables")
// //       return NextResponse.json(
// //         { 
// //           error: "Server configuration error - missing Cloudinary credentials",
// //           details: {
// //             cloudName: !cloudName ? "missing" : "ok",
// //             apiKey: !apiKey ? "missing" : "ok",
// //             apiSecret: !apiSecret ? "missing" : "ok"
// //           }
// //         },
// //         { status: 500 }
// //       )
// //     }
    
// //     // Step 2: Check authentication
// //     console.log("🔐 Checking authentication...")
// //     let session
// //     try {
// //       session = await getServerSession(authOptions)
// //       console.log("Session:", session ? "✅ Valid" : "❌ None")
// //     } catch (authError) {
// //       console.log("❌ Auth error:", authError)
// //       return NextResponse.json(
// //         { error: "Authentication error", details: String(authError) },
// //         { status: 500 }
// //       )
// //     }
    
// //     if (!session || session.user.role !== "ADMIN") {
// //       console.log("❌ Unauthorized access")
// //       return NextResponse.json(
// //         { error: "Unauthorized - Admin access required" },
// //         { status: 401 }
// //       )
// //     }
    
// //     // Step 3: Parse form data - UPDATED to handle title field
// //     console.log("📋 Parsing form data...")
// //     let formData, file, galleryId, alt, caption, title
// //     try {
// //       formData = await request.formData()
// //       file = formData.get("file") as File
// //       galleryId = formData.get("galleryId") as string
// //       alt = formData.get("alt") as string || ""
// //       caption = formData.get("caption") as string || ""
// //       title = formData.get("title") as string || "" // NEW: Title field from admin form
      
// //       console.log("Form data received:", {
// //         file: file ? `✅ ${file.name} (${file.size} bytes)` : "❌ No file",
// //         galleryId: galleryId || "Not provided",
// //         alt: alt || "Empty",
// //         caption: caption || "Empty",
// //         title: title || "Empty" // NEW: Log title
// //       })
// //     } catch (parseError) {
// //       console.log("❌ Form data parse error:", parseError)
// //       return NextResponse.json(
// //         { error: "Failed to parse form data", details: String(parseError) },
// //         { status: 400 }
// //       )
// //     }
    
// //     if (!file) {
// //       return NextResponse.json(
// //         { error: "No file provided" },
// //         { status: 400 }
// //       )
// //     }
    
// //     if (!file.type.startsWith('image/')) {
// //       return NextResponse.json(
// //         { error: "File must be an image" },
// //         { status: 400 }
// //       )
// //     }

// //     // Step 4: Check if galleryId is provided and gallery exists
// //     if (galleryId) {
// //       console.log("🖼️ Checking gallery existence...")
// //       try {
// //         const gallery = await db.gallery.findUnique({
// //           where: { id: galleryId }
// //         })

// //         if (!gallery) {
// //           console.log("❌ Gallery not found:", galleryId)
// //           return NextResponse.json(
// //             { error: "Gallery not found" },
// //             { status: 404 }
// //           )
// //         }
// //         console.log("✅ Gallery found:", gallery.title)
// //       } catch (dbError) {
// //         console.log("❌ Database error checking gallery:", dbError)
// //         return NextResponse.json(
// //           { error: "Database error" },
// //           { status: 500 }
// //         )
// //       }
// //     }
    
// //     // Step 5: Upload to Cloudinary
// //     console.log("☁️ Uploading to Cloudinary...")
    
// //     try {
// //       // Dynamic import to avoid module loading issues
// //       const { v2: cloudinary } = await import('cloudinary')
      
// //       // Configure here to ensure it's set
// //       cloudinary.config({
// //         cloud_name: cloudName,
// //         api_key: apiKey,
// //         api_secret: apiSecret,
// //         secure: true
// //       })
      
// //       const arrayBuffer = await file.arrayBuffer()
// //       const buffer = Buffer.from(arrayBuffer)
      
// //       // Determine upload folder
// //       const uploadFolder = galleryId 
// //         ? `mr-photography/galleries/${galleryId}`
// //         : 'mr-photography/uploads'
      
// //       console.log("📁 Upload folder:", uploadFolder)
      
// //       const uploadResult = await new Promise((resolve, reject) => {
// //         cloudinary.uploader.upload_stream(
// //           {
// //             folder: uploadFolder,
// //             resource_type: 'auto',
// //             transformation: [
// //               { quality: 'auto:best' },
// //               { fetch_format: 'auto' }
// //             ],
// //             // Extended timeout for large files
// //             timeout: 300000, // 5 minutes
// //             // Allow large files
// //             chunk_size: 6000000, // 6MB chunks for large file uploads
// //           },
// //           (error, result) => {
// //             if (error) {
// //               console.log('❌ Cloudinary error:', error)
// //               reject(error)
// //             } else {
// //               console.log('✅ Cloudinary success:', result?.public_id)
// //               resolve(result)
// //             }
// //           }
// //         ).end(buffer)
// //       }) as any
      
// //       console.log("📤 Cloudinary upload completed successfully")
      
// //       // Step 6: Save to database if galleryId provided
// //       if (galleryId) {
// //         console.log("💾 Saving image to database...")
// //         try {
// //           // Get the current highest order in the gallery
// //           const lastImage = await db.galleryImage.findFirst({
// //             where: { galleryId },
// //             orderBy: { order: 'desc' }
// //           })

// //           const nextOrder = lastImage ? lastImage.order + 1 : 0

// //           // UPDATED: Use title or alt text, with fallback to filename
// //           const imageAlt = title || alt || file.name.split('.')[0]
// //           const imageCaption = caption || title || ""

// //           // Save to database
// //           const galleryImage = await db.galleryImage.create({
// //             data: {
// //               url: uploadResult.secure_url,
// //               publicId: uploadResult.public_id,
// //               alt: imageAlt, // UPDATED: Use title if available
// //               caption: imageCaption, // UPDATED: Use caption or title
// //               order: nextOrder,
// //               loves: 0, // NEW: Initialize love count
// //               galleryId,
// //             }
// //           })

// //           console.log("✅ Image saved to database with ID:", galleryImage.id)
          
// //           return NextResponse.json({
// //             success: true,
// //             id: galleryImage.id,
// //             url: galleryImage.url,
// //             publicId: galleryImage.publicId,
// //             alt: galleryImage.alt,
// //             caption: galleryImage.caption,
// //             order: galleryImage.order,
// //             loves: galleryImage.loves, // NEW: Return love count
// //             galleryId: galleryImage.galleryId,
// //             createdAt: galleryImage.createdAt,
// //             uploadDetails: {
// //               size: file.size,
// //               sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
// //               dimensions: `${uploadResult.width}x${uploadResult.height}`,
// //               format: uploadResult.format
// //             },
// //             message: "Image uploaded and saved to gallery successfully"
// //           }, { status: 201 })

// //         } catch (dbError) {
// //           console.log("❌ Database error saving image:", dbError)
// //           return NextResponse.json(
// //             { error: "Failed to save image to database", details: String(dbError) },
// //             { status: 500 }
// //           )
// //         }
// //       } else {
// //         // Return Cloudinary-only result (for slider images)
// //         console.log("📤 Returning Cloudinary-only result")
// //         return NextResponse.json({
// //           success: true,
// //           url: uploadResult.secure_url,
// //           public_id: uploadResult.public_id,
// //           width: uploadResult.width,
// //           height: uploadResult.height,
// //           bytes: uploadResult.bytes,
// //           format: uploadResult.format,
// //           uploadDetails: {
// //             size: file.size,
// //             sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
// //             dimensions: `${uploadResult.width}x${uploadResult.height}`,
// //             format: uploadResult.format
// //           },
// //           message: "Image uploaded to Cloudinary successfully"
// //         })
// //       }
      
// //     } catch (cloudinaryError) {
// //       console.log("❌ Cloudinary upload failed:", cloudinaryError)
// //       return NextResponse.json(
// //         { 
// //           error: "Cloudinary upload failed", 
// //           details: cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError)
// //         },
// //         { status: 500 }
// //       )
// //     }
    
// //   } catch (error) {
// //     console.log("💥 Unexpected error:", error)
// //     return NextResponse.json(
// //       { 
// //         error: "Internal server error",
// //         details: error instanceof Error ? error.message : String(error),
// //         stack: error instanceof Error ? error.stack?.slice(0, 500) : undefined
// //       },
// //       { status: 500 }
// //     )
// //   }
// // }

// // export async function GET() {
// //   console.log("🚀 GET Upload API test")
  
// //   // Test environment variables
// //   const envCheck = {
// //     cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
// //     apiKey: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
// //     apiSecret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing"
// //   }
  
// //   return NextResponse.json({
// //     message: "Upload API is running - Updated for admin form with title support",
// //     timestamp: new Date().toISOString(),
// //     environment: envCheck,
// //     features: [
// //       "Gallery image upload",
// //       "Title field support", 
// //       "Love count initialization",
// //       "Large file handling",
// //       "Database integration"
// //     ],
// //     status: "OK"
// //   })
// // }






// // src/app/api/upload/route.ts - FIXED with Size Protection
// import { NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { db } from "@/lib/db"

// export async function POST(request: NextRequest) {
//   console.log("🚀 Upload API called")
  
//   try {
//     // Step 1: Check environment variables first
//     console.log("🔧 Checking environment variables...")
//     const cloudName = process.env.CLOUDINARY_CLOUD_NAME
//     const apiKey = process.env.CLOUDINARY_API_KEY
//     const apiSecret = process.env.CLOUDINARY_API_SECRET
    
//     console.log("Environment check:", {
//       cloudName: cloudName ? "✅ Set" : "❌ Missing",
//       apiKey: apiKey ? "✅ Set" : "❌ Missing", 
//       apiSecret: apiSecret ? "✅ Set" : "❌ Missing"
//     })
    
//     if (!cloudName || !apiKey || !apiSecret) {
//       console.log("❌ Missing Cloudinary environment variables")
//       return NextResponse.json(
//         { 
//           error: "Server configuration error - missing Cloudinary credentials",
//           details: {
//             cloudName: !cloudName ? "missing" : "ok",
//             apiKey: !apiKey ? "missing" : "ok",
//             apiSecret: !apiSecret ? "missing" : "ok"
//           }
//         },
//         { status: 500 }
//       )
//     }
    
//     // Step 2: Check authentication
//     console.log("🔐 Checking authentication...")
//     let session
//     try {
//       session = await getServerSession(authOptions)
//       console.log("Session:", session ? "✅ Valid" : "❌ None")
//     } catch (authError) {
//       console.log("❌ Auth error:", authError)
//       return NextResponse.json(
//         { error: "Authentication error", details: String(authError) },
//         { status: 500 }
//       )
//     }
    
//     if (!session || session.user.role !== "ADMIN") {
//       console.log("❌ Unauthorized access")
//       return NextResponse.json(
//         { error: "Unauthorized - Admin access required" },
//         { status: 401 }
//       )
//     }
    
//     // Step 3: Parse form data - UPDATED to handle title field
//     console.log("📋 Parsing form data...")
//     let formData, file, galleryId, alt, caption, title
//     try {
//       formData = await request.formData()
//       file = formData.get("file") as File
//       galleryId = formData.get("galleryId") as string
//       alt = formData.get("alt") as string || ""
//       caption = formData.get("caption") as string || ""
//       title = formData.get("title") as string || "" // NEW: Title field from admin form
      
//       console.log("Form data received:", {
//         file: file ? `✅ ${file.name} (${file.size} bytes)` : "❌ No file",
//         galleryId: galleryId || "Not provided",
//         alt: alt || "Empty",
//         caption: caption || "Empty",
//         title: title || "Empty" // NEW: Log title
//       })
//     } catch (parseError) {
//       console.log("❌ Form data parse error:", parseError)
//       return NextResponse.json(
//         { error: "Failed to parse form data", details: String(parseError) },
//         { status: 400 }
//       )
//     }
    
//     if (!file) {
//       return NextResponse.json(
//         { error: "No file provided" },
//         { status: 400 }
//       )
//     }
    
//     if (!file.type.startsWith('image/')) {
//       return NextResponse.json(
//         { error: "File must be an image" },
//         { status: 400 }
//       )
//     }

//     // ✨ NEW: Step 3.5 - FILE SIZE PROTECTION
//     const maxAllowedSize = 10 * 1024 * 1024 // 10MB (Cloudinary free limit)
//     const recommendedSize = 8 * 1024 * 1024 // 8MB (safe target)
    
//     console.log(`📏 File size check: ${file.name} is ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    
//     if (file.size > maxAllowedSize) {
//       console.log(`❌ File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB > 10MB limit`)
      
//       return NextResponse.json({
//         error: "FILE_TOO_LARGE",
//         message: `Image is ${(file.size / 1024 / 1024).toFixed(2)}MB. Cloudinary free plan has a 10MB limit.`,
//         details: {
//           currentSize: file.size,
//           currentSizeMB: (file.size / 1024 / 1024).toFixed(2),
//           maxAllowedSize: maxAllowedSize,
//           maxAllowedSizeMB: "10",
//           recommendedSizeMB: "8",
//           action: "Please compress the image before uploading"
//         },
//         code: "SIZE_LIMIT_EXCEEDED"
//       }, { status: 413 }) // 413 = Payload Too Large
//     }
    
//     if (file.size > recommendedSize) {
//       console.log(`⚠️ File approaching limit: ${(file.size / 1024 / 1024).toFixed(2)}MB > 8MB recommended`)
//       // Log warning but continue - file is under 10MB
//     } else {
//       console.log(`✅ File size OK: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
//     }

//     // Step 4: Check if galleryId is provided and gallery exists
//     if (galleryId) {
//       console.log("🖼️ Checking gallery existence...")
//       try {
//         const gallery = await db.gallery.findUnique({
//           where: { id: galleryId }
//         })

//         if (!gallery) {
//           console.log("❌ Gallery not found:", galleryId)
//           return NextResponse.json(
//             { error: "Gallery not found" },
//             { status: 404 }
//           )
//         }
//         console.log("✅ Gallery found:", gallery.title)
//       } catch (dbError) {
//         console.log("❌ Database error checking gallery:", dbError)
//         return NextResponse.json(
//           { error: "Database error" },
//           { status: 500 }
//         )
//       }
//     }
    
//     // Step 5: Upload to Cloudinary
//     console.log("☁️ Uploading to Cloudinary...")
    
//     try {
//       // Dynamic import to avoid module loading issues
//       const { v2: cloudinary } = await import('cloudinary')
      
//       // Configure here to ensure it's set
//       cloudinary.config({
//         cloud_name: cloudName,
//         api_key: apiKey,
//         api_secret: apiSecret,
//         secure: true
//       })
      
//       const arrayBuffer = await file.arrayBuffer()
//       const buffer = Buffer.from(arrayBuffer)
      
//       // Determine upload folder
//       const uploadFolder = galleryId 
//         ? `mr-photography/galleries/${galleryId}`
//         : 'mr-photography/uploads'
      
//       console.log("📁 Upload folder:", uploadFolder)
      
//       const uploadResult = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           {
//             folder: uploadFolder,
//             resource_type: 'auto',
//             transformation: [
//               { quality: 'auto:best' },
//               { fetch_format: 'auto' }
//             ],
//             // Extended timeout for large files
//             timeout: 300000, // 5 minutes
//             // Allow large files
//             chunk_size: 6000000, // 6MB chunks for large file uploads
//           },
//           (error, result) => {
//             if (error) {
//               console.log('❌ Cloudinary error:', error)
//               reject(error)
//             } else {
//               console.log('✅ Cloudinary success:', result?.public_id)
//               resolve(result)
//             }
//           }
//         ).end(buffer)
//       }) as any
      
//       console.log("📤 Cloudinary upload completed successfully")
      
//       // Step 6: Save to database if galleryId provided
//       if (galleryId) {
//         console.log("💾 Saving image to database...")
//         try {
//           // Get the current highest order in the gallery
//           const lastImage = await db.galleryImage.findFirst({
//             where: { galleryId },
//             orderBy: { order: 'desc' }
//           })

//           const nextOrder = lastImage ? lastImage.order + 1 : 0

//           // UPDATED: Use title or alt text, with fallback to filename
//           const imageAlt = title || alt || file.name.split('.')[0]
//           const imageCaption = caption || title || ""

//           // Save to database
//           const galleryImage = await db.galleryImage.create({
//             data: {
//               url: uploadResult.secure_url,
//               publicId: uploadResult.public_id,
//               alt: imageAlt, // UPDATED: Use title if available
//               caption: imageCaption, // UPDATED: Use caption or title
//               order: nextOrder,
//               loves: 0, // NEW: Initialize love count
//               galleryId,
//             }
//           })

//           console.log("✅ Image saved to database with ID:", galleryImage.id)
          
//           return NextResponse.json({
//             success: true,
//             id: galleryImage.id,
//             url: galleryImage.url,
//             publicId: galleryImage.publicId,
//             alt: galleryImage.alt,
//             caption: galleryImage.caption,
//             order: galleryImage.order,
//             loves: galleryImage.loves, // NEW: Return love count
//             galleryId: galleryImage.galleryId,
//             createdAt: galleryImage.createdAt,
//             uploadDetails: {
//               size: file.size,
//               sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
//               dimensions: `${uploadResult.width}x${uploadResult.height}`,
//               format: uploadResult.format
//             },
//             message: "Image uploaded and saved to gallery successfully"
//           }, { status: 201 })

//         } catch (dbError) {
//           console.log("❌ Database error saving image:", dbError)
//           return NextResponse.json(
//             { error: "Failed to save image to database", details: String(dbError) },
//             { status: 500 }
//           )
//         }
//       } else {
//         // Return Cloudinary-only result (for slider images)
//         console.log("📤 Returning Cloudinary-only result")
//         return NextResponse.json({
//           success: true,
//           url: uploadResult.secure_url,
//           public_id: uploadResult.public_id,
//           width: uploadResult.width,
//           height: uploadResult.height,
//           bytes: uploadResult.bytes,
//           format: uploadResult.format,
//           uploadDetails: {
//             size: file.size,
//             sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
//             dimensions: `${uploadResult.width}x${uploadResult.height}`,
//             format: uploadResult.format
//           },
//           message: "Image uploaded to Cloudinary successfully"
//         })
//       }
      
//     } catch (cloudinaryError) {
//       console.log("❌ Cloudinary upload failed:", cloudinaryError)
//       return NextResponse.json(
//         { 
//           error: "Cloudinary upload failed", 
//           details: cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError)
//         },
//         { status: 500 }
//       )
//     }
    
//   } catch (error) {
//     console.log("💥 Unexpected error:", error)
//     return NextResponse.json(
//       { 
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : String(error),
//         stack: error instanceof Error ? error.stack?.slice(0, 500) : undefined
//       },
//       { status: 500 }
//     )
//   }
// }

// export async function GET() {
//   console.log("🚀 GET Upload API test")
  
//   // Test environment variables
//   const envCheck = {
//     cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
//     apiKey: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
//     apiSecret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing"
//   }
  
//   return NextResponse.json({
//     message: "Upload API is running with SIZE PROTECTION - Blocks files over 10MB",
//     timestamp: new Date().toISOString(),
//     environment: envCheck,
//     features: [
//       "Gallery image upload",
//       "Title field support", 
//       "Love count initialization",
//       "10MB size limit protection", // NEW
//       "Compression requirement for large files", // NEW
//       "Database integration"
//     ],
//     status: "OK"
//   })
// }




// src/app/api/upload/route.ts - ENHANCED with TIFF Support
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { convertImageToJPEG, optimizeImage } from "@/lib/imageConverter"

export async function POST(request: NextRequest) {
  console.log("🚀 Upload API called with TIFF support")
  
  try {
    // Step 1: Check environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Server configuration error - missing Cloudinary credentials" },
        { status: 500 }
      )
    }
    
    // Step 2: Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }
    
    // Step 3: Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const galleryId = formData.get("galleryId") as string
    const alt = formData.get("alt") as string || ""
    const caption = formData.get("caption") as string || ""
    const title = formData.get("title") as string || ""
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    console.log(`📁 Original file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, ${file.type})`)

    // ✨ NEW: Step 3.5 - SMART IMAGE PROCESSING
    let processedBuffer: Buffer
    let processedFileName: string
    let processingInfo: any = {}
    
    try {
      // Check if file needs conversion or is too large
      const isTiff = file.type === 'image/tiff' || file.type === 'image/tif' || file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')
      const isLarge = file.size > 10 * 1024 * 1024 // Over 10MB
      
      if (isTiff) {
        console.log(`🔄 TIFF file detected, converting to JPEG...`)
        const conversionResult = await convertImageToJPEG(file)
        
        // Check if converted file is still too large
        if (conversionResult.convertedSize > 10 * 1024 * 1024) {
          console.log(`⚠️ Converted file still large (${(conversionResult.convertedSize / 1024 / 1024).toFixed(2)}MB), optimizing...`)
          
          // Create a temporary file from the converted buffer
          const tempFile = new File([conversionResult.buffer], file.name.replace(/\.tiff?$/i, '.jpg'), { type: 'image/jpeg' })
          const optimizationResult = await optimizeImage(tempFile, {
            maxWidth: 3840,
            maxHeight: 2160,
            quality: 80
          })
          
          processedBuffer = optimizationResult.buffer
          processedFileName = file.name.replace(/\.tiff?$/i, '.jpg')
          processingInfo = {
            originalFormat: 'TIFF',
            finalFormat: 'JPEG',
            originalSize: file.size,
            convertedSize: conversionResult.convertedSize,
            finalSize: optimizationResult.convertedSize,
            wasConverted: true,
            wasOptimized: true,
            dimensions: `${optimizationResult.width}×${optimizationResult.height}`
          }
        } else {
          processedBuffer = conversionResult.buffer
          processedFileName = file.name.replace(/\.tiff?$/i, '.jpg')
          processingInfo = {
            originalFormat: 'TIFF',
            finalFormat: 'JPEG',
            originalSize: file.size,
            finalSize: conversionResult.convertedSize,
            wasConverted: true,
            wasOptimized: false,
            dimensions: `${conversionResult.width}×${conversionResult.height}`
          }
        }
        
        console.log(`✅ TIFF processing complete: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`)
        
      } else if (isLarge) {
        console.log(`📦 Large file detected (${(file.size / 1024 / 1024).toFixed(2)}MB), optimizing...`)
        const optimizationResult = await optimizeImage(file, {
          maxWidth: 3840,
          maxHeight: 2160,
          quality: 80
        })
        
        processedBuffer = optimizationResult.buffer
        processedFileName = file.name.replace(/\.[^/.]+$/, '.jpg')
        processingInfo = {
          originalFormat: file.type,
          finalFormat: 'JPEG',
          originalSize: file.size,
          finalSize: optimizationResult.convertedSize,
          wasConverted: false,
          wasOptimized: true,
          dimensions: `${optimizationResult.width}×${optimizationResult.height}`
        }
        
        console.log(`✅ Optimization complete: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`)
        
      } else {
        // Small supported file - use as-is
        console.log(`✅ File size acceptable, processing as-is`)
        const arrayBuffer = await file.arrayBuffer()
        processedBuffer = Buffer.from(arrayBuffer)
        processedFileName = file.name
        processingInfo = {
          originalFormat: file.type,
          finalFormat: file.type,
          originalSize: file.size,
          finalSize: file.size,
          wasConverted: false,
          wasOptimized: false
        }
      }
      
    } catch (conversionError) {
      console.error('❌ Image processing failed:', conversionError)
      return NextResponse.json({
        error: "IMAGE_PROCESSING_FAILED",
        message: `Failed to process image: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`,
        details: {
          originalFile: file.name,
          originalSize: file.size,
          fileType: file.type
        }
      }, { status: 422 })
    }
    
    // Final size check
    if (processedBuffer.length > 10 * 1024 * 1024) {
      console.log(`❌ Processed file still too large: ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`)
      return NextResponse.json({
        error: "FILE_STILL_TOO_LARGE",
        message: `Even after processing, file is ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB. Maximum allowed is 10MB.`,
        details: {
          ...processingInfo,
          finalSizeMB: (processedBuffer.length / 1024 / 1024).toFixed(2)
        }
      }, { status: 413 })
    }

    // Step 4: Check gallery exists if provided
    if (galleryId) {
      const gallery = await db.gallery.findUnique({
        where: { id: galleryId }
      })
      if (!gallery) {
        return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
      }
    }
    
    // Step 5: Upload to Cloudinary
    console.log("☁️ Uploading processed image to Cloudinary...")
    
    try {
      const { v2: cloudinary } = await import('cloudinary')
      
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
      })
      
      const uploadFolder = galleryId 
        ? `mr-photography/galleries/${galleryId}`
        : 'mr-photography/uploads'
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: uploadFolder,
            resource_type: 'auto',
            transformation: [
              { quality: 'auto:best' },
              { fetch_format: 'auto' }
            ],
            timeout: 300000,
            chunk_size: 6000000,
            // Use processed filename
            public_id: processedFileName.replace(/\.[^/.]+$/, ''),
          },
          (error, result) => {
            if (error) {
              console.log('❌ Cloudinary error:', error)
              reject(error)
            } else {
              console.log('✅ Cloudinary success:', result?.public_id)
              resolve(result)
            }
          }
        ).end(processedBuffer)
      }) as any
      
      console.log("📤 Cloudinary upload completed successfully")
      
      // Step 6: Save to database if gallery provided
      if (galleryId) {
        const lastImage = await db.galleryImage.findFirst({
          where: { galleryId },
          orderBy: { order: 'desc' }
        })

        const nextOrder = lastImage ? lastImage.order + 1 : 0
        const imageAlt = title || alt || processedFileName.split('.')[0]
        const imageCaption = caption || title || ""

        const galleryImage = await db.galleryImage.create({
          data: {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            alt: imageAlt,
            caption: imageCaption,
            order: nextOrder,
            loves: 0,
            galleryId,
          }
        })

        return NextResponse.json({
          success: true,
          id: galleryImage.id,
          url: galleryImage.url,
          publicId: galleryImage.publicId,
          alt: galleryImage.alt,
          caption: galleryImage.caption,
          order: galleryImage.order,
          loves: galleryImage.loves,
          galleryId: galleryImage.galleryId,
          createdAt: galleryImage.createdAt,
          uploadDetails: {
            ...processingInfo,
            cloudinaryDimensions: `${uploadResult.width}x${uploadResult.height}`,
            cloudinaryFormat: uploadResult.format
          },
          message: processingInfo.wasConverted 
            ? "TIFF image converted to JPEG and uploaded successfully"
            : "Image uploaded successfully"
        }, { status: 201 })

      } else {
        // Return Cloudinary-only result (for slider images)
        return NextResponse.json({
          success: true,
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          bytes: uploadResult.bytes,
          format: uploadResult.format,
          uploadDetails: {
            ...processingInfo,
            cloudinaryDimensions: `${uploadResult.width}x${uploadResult.height}`,
            cloudinaryFormat: uploadResult.format
          },
          message: processingInfo.wasConverted 
            ? "TIFF image converted to JPEG and uploaded successfully"
            : "Image uploaded successfully"
        })
      }
      
    } catch (cloudinaryError) {
      console.log("❌ Cloudinary upload failed:", cloudinaryError)
      return NextResponse.json({
        error: "Cloudinary upload failed",
        details: cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError)
      }, { status: 500 })
    }
    
  } catch (error) {
    console.log("💥 Unexpected error:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Upload API with TIFF support - Converts TIFF to JPEG automatically",
    timestamp: new Date().toISOString(),
    features: [
      "TIFF to JPEG conversion",
      "Automatic image optimization", 
      "Large file compression",
      "10MB size limit protection",
      "Gallery integration",
      "Smart processing pipeline"
    ],
    supportedFormats: [
      "JPEG", "PNG", "WebP", "GIF", "TIFF", "BMP", "AVIF"
    ],
    status: "OK"
  })
}