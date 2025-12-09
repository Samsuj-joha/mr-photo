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
import { processImageForUpload } from "@/lib/imageProcessor"

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
    const galleryId = formData.get("galleryId") as string | null
    const alt = formData.get("alt") as string || ""
    const caption = formData.get("caption") as string || ""
    const title = formData.get("title") as string || ""
    const year = formData.get("year") as string | null
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    console.log(`📁 Original file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, ${file.type})`)

    // Step 3.5: Process image to ensure 10MB or less (same as home slider and other uploads)
    let processedBuffer: Buffer
    let processedFileName: string
    let processingInfo: any = {}
    
    try {
      const processed = await processImageForUpload(file)
      processedBuffer = processed.buffer
      processedFileName = processed.fileName
      processingInfo = processed.processingInfo
      
      console.log(`✅ Image processed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`)
      
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
    
    // Final size check (should already be 10MB or less, but double-check)
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
      
      // Step 5.5: Verify the image actually exists in Cloudinary
      try {
        const verifyResponse = await fetch(uploadResult.secure_url, { method: 'HEAD' })
        if (!verifyResponse.ok) {
          console.error(`⚠️ WARNING: Image uploaded but verification failed: ${uploadResult.secure_url}`)
          console.error(`Status: ${verifyResponse.status}, Cloudinary may not have processed the image yet`)
          // Continue anyway - sometimes Cloudinary needs a moment to process
        } else {
          console.log("✅ Image verified in Cloudinary")
        }
      } catch (verifyError) {
        console.error("⚠️ Could not verify image existence:", verifyError)
        // Continue anyway - network issues shouldn't block upload
      }
      
      // Step 6: Auto-categorize image using AI (with multiple categories support)
      let detectedCategory = "Others"
      try {
        console.log("🤖 Detecting category for image...")
        
        // Get the base URL for API calls
        const baseUrl = process.env.NEXTAUTH_URL || 
                       process.env.NEXT_PUBLIC_APP_URL || 
                       (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
        
        const categoryResponse = await fetch(`${baseUrl}/api/ai/detect-category`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: uploadResult.secure_url,
            fileName: file.name
          })
        })

        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          // Support multiple categories - use categories array if available, otherwise combine with alternatives
          if (categoryData.categories && categoryData.categories.length > 0) {
            // Use the categories array directly (already top 3)
            detectedCategory = categoryData.categories.join(", ")
          } else if (categoryData.alternatives && categoryData.alternatives.length > 0) {
            // Fallback: combine main category with alternatives (top 3)
            const allCategories = [
              categoryData.category,
              ...categoryData.alternatives.slice(0, 2)
            ].filter((cat, idx, arr) => arr.indexOf(cat) === idx) // Remove duplicates
            detectedCategory = allCategories.join(", ")
          } else {
            detectedCategory = categoryData.category || "Others"
          }
          const method = categoryData.method || "unknown"
          console.log(`✅ Category detected: ${detectedCategory} (method: ${method}, confidence: ${categoryData.confidence || 'N/A'})`)
          
          // Warn if using fallback method (but only once to reduce log noise)
          if (method.includes("filename") || method.includes("fallback")) {
            if (categoryData.errorType === "quota_exceeded") {
              // Quota warning already logged in detect-category route, skip here
            } else {
              console.log("⚠️ Using filename-based detection (AI not available)")
            }
          }
        } else {
          const errorText = await categoryResponse.text()
          console.log(`⚠️ Category detection failed (${categoryResponse.status}): ${errorText}, using default: Others`)
        }
      } catch (categoryError) {
        console.error("⚠️ Category detection error:", categoryError)
        // Continue with default category
      }

      // Step 7: Save to database ONLY if galleryId is provided
      // For home slider and other non-gallery uploads, just return Cloudinary result
      if (galleryId) {
        console.log("💾 Saving image to gallery database...")
        
        // Step 8: Save to database
        const lastImage = await db.galleryImage.findFirst({
          where: { galleryId },
          orderBy: { order: 'desc' },
          select: { order: true }
        })

        const nextOrder = lastImage ? lastImage.order + 1 : 0
        const imageAlt = title || alt || processedFileName.split('.')[0]
        const imageCaption = caption || title || ""
        
        // Use provided year or default to current year
        const uploadYear = year ? parseInt(year) : new Date().getFullYear()

        // Create gallery image with year and category fields
        let galleryImage
        
        // Try to create with year and category fields
        const dataToCreate: any = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          alt: imageAlt,
          caption: imageCaption,
          order: nextOrder,
          loves: 0,
          galleryId: galleryId,
          year: uploadYear,
          category: detectedCategory,
          published: false, // Images start as draft, must be published to appear on gallery
        }
        
        try {
          galleryImage = await db.galleryImage.create({ data: dataToCreate })
          console.log("✅ Image saved to gallery database")
        } catch (error: any) {
          // If creation fails, return the error
          console.error("❌ Failed to create image in database:", error)
          return NextResponse.json({
            error: "Database error",
            message: `Failed to save image to database: ${error instanceof Error ? error.message : String(error)}`,
            details: error instanceof Error ? error.message : String(error)
          }, { status: 500 })
        }

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
          category: (galleryImage as any).category || detectedCategory,
          year: (galleryImage as any).year || uploadYear,
          createdAt: galleryImage.createdAt,
          uploadDetails: {
            ...processingInfo,
            cloudinaryDimensions: `${uploadResult.width}x${uploadResult.height}`,
            cloudinaryFormat: uploadResult.format,
            detectedCategory
          },
          message: processingInfo.wasConverted 
            ? "TIFF image converted to JPEG and uploaded successfully"
            : "Image uploaded and categorized successfully"
        }, { status: 201 })
      } else {
        // No galleryId provided - return Cloudinary-only result (for home slider, etc.)
        console.log("📤 Returning Cloudinary-only result (no gallery entry created)")
        return NextResponse.json({
          success: true,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          bytes: uploadResult.bytes,
          format: uploadResult.format,
          uploadDetails: {
            ...processingInfo,
            cloudinaryDimensions: `${uploadResult.width}x${uploadResult.height}`,
            cloudinaryFormat: uploadResult.format,
            detectedCategory
          },
          message: processingInfo.wasConverted 
            ? "TIFF image converted to JPEG and uploaded successfully"
            : "Image uploaded to Cloudinary successfully"
        })
      }
      
    } catch (cloudinaryError) {
      console.error("❌ Cloudinary upload failed:", cloudinaryError)
      const errorDetails = cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError)
      console.error("Error details:", errorDetails)
      return NextResponse.json({
        error: "Cloudinary upload failed",
        message: `Failed to upload to Cloudinary: ${errorDetails}`,
        details: errorDetails
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("💥 Unexpected error in upload API:", error)
    const errorDetails = error instanceof Error ? error.message : String(error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({
      error: "Internal server error",
      message: `Upload failed: ${errorDetails}`,
      details: errorDetails
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