// // // src/app/admin/home-slider/page.tsx
// // "use client"

// // import { useState, useEffect } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Switch } from "@/components/ui/switch"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Textarea } from "@/components/ui/textarea"
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog"
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog"
// // import {
// //   Plus,
// //   Trash2,
// //   Edit,
// //   Eye,
// //   EyeOff,
// //   GripVertical,
// //   Upload,
// //   Loader2,
// //   Image as ImageIcon,
// // } from "lucide-react"
// // import Image from "next/image"

// // interface SliderImage {
// //   id: string
// //   title?: string
// //   description?: string
// //   imageUrl: string
// //   publicId: string
// //   alt?: string
// //   order: number
// //   active: boolean
// //   linkUrl?: string
// //   linkText?: string
// //   createdAt: string
// //   updatedAt: string
// // }

// // export default function AdminHomeSlider() {
// //   const [sliderImages, setSliderImages] = useState<SliderImage[]>([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [isUploading, setIsUploading] = useState(false)
// //   const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
// //   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

// //   // Form states
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     alt: "",
// //     linkUrl: "",
// //     linkText: "",
// //     active: true,
// //     selectedFile: null as File | null
// //   })

// //   useEffect(() => {
// //     fetchSliderImages()
// //   }, [])

// //   const fetchSliderImages = async () => {
// //     try {
// //       const response = await fetch("/api/home-slider")
// //       if (response.ok) {
// //         const data = await response.json()
// //         setSliderImages(data)
// //       }
// //     } catch (error) {
// //       console.error("Error fetching slider images:", error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleSubmit = async () => {
// //     if (!formData.selectedFile) {
// //       alert("Please select an image first")
// //       return
// //     }
    
// //     setIsUploading(true)
    
// //     try {
// //       // Upload to Cloudinary
// //       const uploadFormData = new FormData()
// //       uploadFormData.append("file", formData.selectedFile)
      
// //       const uploadResponse = await fetch("/api/upload", {
// //         method: "POST",
// //         body: uploadFormData,
// //       })

// //       if (uploadResponse.ok) {
// //         const uploadData = await uploadResponse.json()
        
// //         // Create slider entry
// //         const sliderData = {
// //           title: formData.title,
// //           description: formData.description,
// //           alt: formData.alt,
// //           linkUrl: formData.linkUrl,
// //           linkText: formData.linkText,
// //           active: formData.active,
// //           imageUrl: uploadData.url,
// //           publicId: uploadData.public_id,
// //           order: sliderImages.length
// //         }

// //         const response = await fetch("/api/home-slider", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(sliderData),
// //         })

// //         if (response.ok) {
// //           await fetchSliderImages()
// //           setIsCreateModalOpen(false)
// //           resetForm()
// //           alert("Slider image created successfully!")
// //         } else {
// //           alert("Failed to create slider image")
// //         }
// //       } else {
// //         alert("Failed to upload image")
// //       }
// //     } catch (error) {
// //       console.error("Error creating slider:", error)
// //       alert("Error creating slider image")
// //     } finally {
// //       setIsUploading(false)
// //     }
// //   }

// //   const updateSliderImage = async (id: string, updates: Partial<SliderImage>) => {
// //     try {
// //       const response = await fetch(`/api/home-slider/${id}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(updates),
// //       })

// //       if (response.ok) {
// //         await fetchSliderImages()
// //       }
// //     } catch (error) {
// //       console.error("Error updating slider image:", error)
// //     }
// //   }

// //   const deleteSliderImage = async (id: string) => {
// //     try {
// //       const response = await fetch(`/api/home-slider/${id}`, {
// //         method: "DELETE",
// //       })

// //       if (response.ok) {
// //         await fetchSliderImages()
// //         alert("Slider image deleted successfully!")
// //       } else {
// //         alert("Failed to delete slider image")
// //       }
// //     } catch (error) {
// //       console.error("Error deleting slider image:", error)
// //       alert("Error deleting slider image")
// //     }
// //   }

// //   const toggleActive = async (id: string, active: boolean) => {
// //     await updateSliderImage(id, { active })
// //   }

// //   const resetForm = () => {
// //     setFormData({
// //       title: "",
// //       description: "",
// //       alt: "",
// //       linkUrl: "",
// //       linkText: "",
// //       active: true,
// //       selectedFile: null
// //     })
// //     setEditingImage(null)
// //   }

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center py-12">
// //         <Loader2 className="h-8 w-8 animate-spin" />
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
// //             Home Page Slider
// //           </h1>
// //           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
// //             Manage the sliding images on your home page
// //           </p>
// //         </div>
        
// //         <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
// //           <DialogTrigger asChild>
// //             <Button>
// //               <Plus className="h-4 w-4 mr-2" />
// //               Add New Image
// //             </Button>
// //           </DialogTrigger>
// //           <DialogContent className="max-w-md">
// //             <DialogHeader>
// //               <DialogTitle>Add Slider Image</DialogTitle>
// //               <DialogDescription>
// //                 Upload a new image for the home page slider
// //               </DialogDescription>
// //             </DialogHeader>
            
// //             <div className="space-y-4">
// //               <div>
// //                 <Label htmlFor="title">Title (Optional)</Label>
// //                 <Input
// //                   id="title"
// //                   value={formData.title}
// //                   onChange={(e) => setFormData({...formData, title: e.target.value})}
// //                   placeholder="Enter slide title"
// //                 />
// //               </div>
              
// //               <div>
// //                 <Label htmlFor="description">Description (Optional)</Label>
// //                 <Textarea
// //                   id="description"
// //                   value={formData.description}
// //                   onChange={(e) => setFormData({...formData, description: e.target.value})}
// //                   placeholder="Enter slide description"
// //                   rows={3}
// //                 />
// //               </div>
              
// //               <div>
// //                 <Label htmlFor="alt">Alt Text</Label>
// //                 <Input
// //                   id="alt"
// //                   value={formData.alt}
// //                   onChange={(e) => setFormData({...formData, alt: e.target.value})}
// //                   placeholder="Describe the image"
// //                 />
// //               </div>
              
// //               <div>
// //                 <Label htmlFor="linkUrl">Link URL (Optional)</Label>
// //                 <Input
// //                   id="linkUrl"
// //                   value={formData.linkUrl}
// //                   onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
// //                   placeholder="https://example.com"
// //                 />
// //               </div>
              
// //               <div>
// //                 <Label htmlFor="linkText">Link Text (Optional)</Label>
// //                 <Input
// //                   id="linkText"
// //                   value={formData.linkText}
// //                   onChange={(e) => setFormData({...formData, linkText: e.target.value})}
// //                   placeholder="Learn More"
// //                 />
// //               </div>
              
// //               <div className="flex items-center space-x-2">
// //                 <Switch
// //                   checked={formData.active}
// //                   onCheckedChange={(checked) => setFormData({...formData, active: checked})}
// //                 />
// //                 <Label>Active</Label>
// //               </div>
              
// //               {/* Image Upload Section */}
// //               <div>
// //                 <Label>Select Image *</Label>
// //                 <div className="mt-2">
// //                   <Input
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={(e) => {
// //                       const file = e.target.files?.[0]
// //                       if (file) {
// //                         setFormData({...formData, selectedFile: file})
// //                       }
// //                     }}
// //                     disabled={isUploading}
// //                     className="mb-2"
// //                   />
// //                   {formData.selectedFile && (
// //                     <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
// //                       <ImageIcon className="h-4 w-4 mr-2" />
// //                       {formData.selectedFile.name}
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
              
// //               {isUploading && (
// //                 <div className="flex items-center justify-center py-4">
// //                   <Loader2 className="h-6 w-6 animate-spin mr-2" />
// //                   Uploading image...
// //                 </div>
// //               )}
// //             </div>
            
// //             {/* Dialog Footer with proper buttons */}
// //             <div className="flex justify-end space-x-2 pt-4 border-t">
// //               <Button 
// //                 variant="outline" 
// //                 onClick={() => {
// //                   setIsCreateModalOpen(false)
// //                   resetForm()
// //                 }}
// //                 disabled={isUploading}
// //               >
// //                 Cancel
// //               </Button>
// //               <Button 
// //                 onClick={handleSubmit}
// //                 disabled={isUploading || !formData.selectedFile}
// //               >
// //                 {isUploading ? (
// //                   <>
// //                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
// //                     Creating...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Plus className="h-4 w-4 mr-2" />
// //                     Create Slide
// //                   </>
// //                 )}
// //               </Button>
// //             </div>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       {/* Slider Images Grid */}
// //       {sliderImages.length === 0 ? (
// //         <Card className="text-center py-12">
// //           <CardContent>
// //             <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
// //               No slider images yet
// //             </h3>
// //             <p className="text-gray-500 dark:text-gray-400 mb-4">
// //               Get started by adding your first slider image.
// //             </p>
// //             <Button onClick={() => setIsCreateModalOpen(true)}>
// //               <Plus className="h-4 w-4 mr-2" />
// //               Add First Image
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       ) : (
// //         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //           {sliderImages.map((image, index) => (
// //             <Card key={image.id} className="overflow-hidden">
// //               <div className="relative h-48">
// //                 <Image
// //                   src={image.imageUrl}
// //                   alt={image.alt || image.title || "Slider image"}
// //                   fill
// //                   className="object-cover"
// //                 />
// //                 <div className="absolute top-2 right-2 flex space-x-1">
// //                   <Badge variant={image.active ? "default" : "secondary"}>
// //                     {image.active ? "Active" : "Inactive"}
// //                   </Badge>
// //                   <Badge variant="outline">#{index + 1}</Badge>
// //                 </div>
// //               </div>
              
// //               <CardHeader>
// //                 <CardTitle className="text-lg">
// //                   {image.title || "Untitled Slide"}
// //                 </CardTitle>
// //                 {image.description && (
// //                   <CardDescription>{image.description}</CardDescription>
// //                 )}
// //               </CardHeader>
              
// //               <CardContent>
// //                 <div className="flex items-center justify-between">
// //                   <div className="flex items-center space-x-2">
// //                     <Switch
// //                       checked={image.active}
// //                       onCheckedChange={(checked) => toggleActive(image.id, checked)}
// //                     />
// //                     <span className="text-sm text-gray-600 dark:text-gray-400">
// //                       {image.active ? "Visible" : "Hidden"}
// //                     </span>
// //                   </div>
                  
// //                   <div className="flex space-x-1">
// //                     <Button variant="ghost" size="sm">
// //                       <Edit className="h-4 w-4" />
// //                     </Button>
                    
// //                     <AlertDialog>
// //                       <AlertDialogTrigger asChild>
// //                         <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
// //                           <Trash2 className="h-4 w-4" />
// //                         </Button>
// //                       </AlertDialogTrigger>
// //                       <AlertDialogContent>
// //                         <AlertDialogHeader>
// //                           <AlertDialogTitle>Delete Slider Image</AlertDialogTitle>
// //                           <AlertDialogDescription>
// //                             Are you sure you want to delete this slider image? This action cannot be undone.
// //                           </AlertDialogDescription>
// //                         </AlertDialogHeader>
// //                         <AlertDialogFooter>
// //                           <AlertDialogCancel>Cancel</AlertDialogCancel>
// //                           <AlertDialogAction
// //                             onClick={() => deleteSliderImage(image.id)}
// //                             className="bg-red-600 hover:bg-red-700"
// //                           >
// //                             Delete
// //                           </AlertDialogAction>
// //                         </AlertDialogFooter>
// //                       </AlertDialogContent>
// //                     </AlertDialog>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }




// // src/app/admin/home-slider/page.tsx - FIXED with Auto-Compression
// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import {
//   Plus,
//   Trash2,
//   Edit,
//   Eye,
//   EyeOff,
//   GripVertical,
//   Upload,
//   Loader2,
//   Image as ImageIcon,
//   Zap,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react"
// import Image from "next/image"

// // ✨ CRITICAL: Import compression functions
// import { resizeForCloudinary, formatFileSize, needsCompression } from "@/lib/quickResize"

// interface SliderImage {
//   id: string
//   title?: string
//   description?: string
//   imageUrl: string
//   publicId: string
//   alt?: string
//   order: number
//   active: boolean
//   linkUrl?: string
//   linkText?: string
//   createdAt: string
//   updatedAt: string
// }

// export default function AdminHomeSlider() {
//   const [sliderImages, setSliderImages] = useState<SliderImage[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isUploading, setIsUploading] = useState(false)
//   const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
//   // ✨ NEW: Compression states
//   const [isCompressing, setIsCompressing] = useState(false)
//   const [compressionInfo, setCompressionInfo] = useState("")
//   const [uploadProgress, setUploadProgress] = useState("")

//   // Form states
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     alt: "",
//     linkUrl: "",
//     linkText: "",
//     active: true,
//     selectedFile: null as File | null,
//     originalFile: null as File | null // Track original for display
//   })

//   useEffect(() => {
//     fetchSliderImages()
//   }, [])

//   const fetchSliderImages = async () => {
//     try {
//       const response = await fetch("/api/home-slider")
//       if (response.ok) {
//         const data = await response.json()
//         setSliderImages(data)
//       }
//     } catch (error) {
//       console.error("Error fetching slider images:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // ✨ NEW: Enhanced file selection with auto-compression
//   const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     console.log(`📁 File selected: ${file.name} (${formatFileSize(file.size)})`)
//     console.log(`📝 File type: ${file.type}`)
    
//     // Store original file for reference
//     setFormData(prev => ({
//       ...prev,
//       originalFile: file,
//       selectedFile: null
//     }))
//     setCompressionInfo("")
//     setUploadProgress("")

//     // Check if compression is needed
//     const needsCompression = file.size > 8 * 1024 * 1024 // 8MB threshold

//     if (needsCompression) {
//       setIsCompressing(true)
//       setCompressionInfo(`🔍 Analyzing ${file.name} (${formatFileSize(file.size)})...`)
      
//       try {
//         console.log(`🗜️ Large file detected (${formatFileSize(file.size)}), compressing...`)
        
//         // Test if the file can be processed
//         const testImg = document.createElement('img')
//         const imageLoadPromise = new Promise((resolve, reject) => {
//           testImg.onload = () => {
//             console.log(`✅ Image loaded successfully: ${testImg.width}x${testImg.height}`)
//             resolve(true)
//           }
//           testImg.onerror = (error) => {
//             console.log(`❌ Image load failed:`, error)
//             reject(new Error(`Cannot load ${file.type} file as image`))
//           }
//           testImg.src = URL.createObjectURL(file)
//         })
        
//         // Wait for image to load
//         await imageLoadPromise
//         URL.revokeObjectURL(testImg.src)
        
//         const compressionResult = await resizeForCloudinary(file)
        
//         setFormData(prev => ({
//           ...prev,
//           selectedFile: compressionResult.file
//         }))
        
//         const savedSpace = compressionResult.originalSize - compressionResult.newSize
//         const compressionPercent = (compressionResult.compressionRatio * 100).toFixed(1)
        
//         setCompressionInfo(`✅ Compression Complete!
// 📁 Original: ${file.name} (${formatFileSize(compressionResult.originalSize)})
// 📦 Compressed: ${formatFileSize(compressionResult.newSize)}
// 💾 Space Saved: ${formatFileSize(savedSpace)} (${compressionPercent}% reduction)
// 📏 Dimensions: ${compressionResult.dimensions.width}×${compressionResult.dimensions.height}
// 🎯 Cloudinary Ready: ${compressionResult.newSize < 10 * 1024 * 1024 ? '✅ YES' : '❌ Still too large'}`)
        
//         console.log(`✅ Compression successful: ${formatFileSize(compressionResult.originalSize)} → ${formatFileSize(compressionResult.newSize)}`)
        
//       } catch (error) {
//         console.error("❌ Compression failed:", error)
        
//         let errorMsg = ""
//         if (error instanceof Error) {
//           if (error.message.includes("Cannot load")) {
//             errorMsg = `❌ Unsupported File Type: ${file.type}
// 📝 File: ${file.name}
// ⚠️ TIFF files are not supported by browser compression.
// 💡 Please convert to JPEG/PNG first, or try a different file.`
//           } else {
//             errorMsg = `❌ Compression Failed: ${error.message}`
//           }
//         } else {
//           errorMsg = `❌ Unknown compression error`
//         }
        
//         setCompressionInfo(`${errorMsg}

// 📁 Using original file: ${file.name} (${formatFileSize(file.size)})
// ⚠️ File will be rejected by server (10MB limit)`)
        
//         // Fallback to original file
//         setFormData(prev => ({
//           ...prev,
//           selectedFile: file
//         }))
//       } finally {
//         setIsCompressing(false)
//       }
//     } else {
//       // Small file - use as-is
//       setFormData(prev => ({
//         ...prev,
//         selectedFile: file
//       }))
//       setCompressionInfo(`✅ File size acceptable (${formatFileSize(file.size)})
// 📁 File: ${file.name}
// 🎯 No compression needed - ready for upload!`)
//     }
//   }

//   // ✨ ENHANCED: handleSubmit with better error handling
//   const handleSubmit = async () => {
//     if (!formData.selectedFile) {
//       alert("Please select an image first")
//       return
//     }
    
//     setIsUploading(true)
//     setUploadProgress("🚀 Starting upload...")
    
//     try {
//       console.log(`🚀 Uploading ${formData.selectedFile.name} (${formatFileSize(formData.selectedFile.size)})`)
      
//       // Upload to Cloudinary
//       const uploadFormData = new FormData()
//       uploadFormData.append("file", formData.selectedFile)
      
//       setUploadProgress("☁️ Uploading to Cloudinary...")
      
//       const uploadResponse = await fetch("/api/upload", {
//         method: "POST",
//         body: uploadFormData,
//       })

//       const responseText = await uploadResponse.text()
      
//       if (uploadResponse.ok) {
//         const uploadData = JSON.parse(responseText)
//         console.log("✅ Upload successful:", uploadData)
        
//         setUploadProgress("💾 Creating slider entry...")
        
//         // Create slider entry
//         const sliderData = {
//           title: formData.title,
//           description: formData.description,
//           alt: formData.alt,
//           linkUrl: formData.linkUrl,
//           linkText: formData.linkText,
//           active: formData.active,
//           imageUrl: uploadData.url,
//           publicId: uploadData.public_id,
//           order: sliderImages.length
//         }

//         const response = await fetch("/api/home-slider", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(sliderData),
//         })

//         if (response.ok) {
//           await fetchSliderImages()
//           setIsCreateModalOpen(false)
//           resetForm()
//           alert("🎉 Slider image uploaded successfully!")
//         } else {
//           const errorData = await response.json()
//           throw new Error(`Failed to create slider: ${errorData.error || 'Unknown error'}`)
//         }
//       } else {
//         // Handle upload errors
//         let errorData
//         try {
//           errorData = JSON.parse(responseText)
//         } catch {
//           errorData = { error: responseText }
//         }
        
//         if (errorData.error === "FILE_TOO_LARGE") {
//           throw new Error(`File too large: ${errorData.details?.currentSizeMB}MB. Please try a smaller image or contact support.`)
//         }
        
//         throw new Error(`Upload failed: ${errorData.error || `Server error ${uploadResponse.status}`}`)
//       }
//     } catch (error) {
//       console.error("❌ Upload error:", error)
//       const errorMessage = error instanceof Error ? error.message : 'Unknown upload error'
//       alert(`❌ Upload failed: ${errorMessage}`)
//       setUploadProgress(`❌ Failed: ${errorMessage}`)
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const updateSliderImage = async (id: string, updates: Partial<SliderImage>) => {
//     try {
//       const response = await fetch(`/api/home-slider/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updates),
//       })

//       if (response.ok) {
//         await fetchSliderImages()
//       }
//     } catch (error) {
//       console.error("Error updating slider image:", error)
//     }
//   }

//   const deleteSliderImage = async (id: string) => {
//     try {
//       const response = await fetch(`/api/home-slider/${id}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         await fetchSliderImages()
//         alert("Slider image deleted successfully!")
//       } else {
//         alert("Failed to delete slider image")
//       }
//     } catch (error) {
//       console.error("Error deleting slider image:", error)
//       alert("Error deleting slider image")
//     }
//   }

//   const toggleActive = async (id: string, active: boolean) => {
//     await updateSliderImage(id, { active })
//   }

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       alt: "",
//       linkUrl: "",
//       linkText: "",
//       active: true,
//       selectedFile: null,
//       originalFile: null
//     })
//     setEditingImage(null)
//     setCompressionInfo("")
//     setUploadProgress("")
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Home Page Slider
//           </h1>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Manage the sliding images on your home page • Auto-compression enabled
//           </p>
//         </div>
        
//         <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Add New Image
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-lg">
//             <DialogHeader>
//               <DialogTitle>Add Slider Image</DialogTitle>
//               <DialogDescription>
//                 Upload a new image for the home page slider. Large images will be automatically compressed.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="title">Title (Optional)</Label>
//                 <Input
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => setFormData({...formData, title: e.target.value})}
//                   placeholder="Enter slide title"
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="description">Description (Optional)</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({...formData, description: e.target.value})}
//                   placeholder="Enter slide description"
//                   rows={3}
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="alt">Alt Text</Label>
//                 <Input
//                   id="alt"
//                   value={formData.alt}
//                   onChange={(e) => setFormData({...formData, alt: e.target.value})}
//                   placeholder="Describe the image"
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="linkUrl">Link URL (Optional)</Label>
//                 <Input
//                   id="linkUrl"
//                   value={formData.linkUrl}
//                   onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
//                   placeholder="https://example.com"
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="linkText">Link Text (Optional)</Label>
//                 <Input
//                   id="linkText"
//                   value={formData.linkText}
//                   onChange={(e) => setFormData({...formData, linkText: e.target.value})}
//                   placeholder="Learn More"
//                 />
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <Switch
//                   checked={formData.active}
//                   onCheckedChange={(checked) => setFormData({...formData, active: checked})}
//                 />
//                 <Label>Active</Label>
//               </div>
              
//               {/* ✨ ENHANCED: Image Upload Section */}
//               <div>
//                 <Label>Select Image *</Label>
//                 <div className="mt-2 space-y-3">
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileSelect}
//                     disabled={isUploading || isCompressing}
//                     className="mb-2"
//                   />
                  
//                   {/* File Info Display */}
//                   {(formData.selectedFile || formData.originalFile) && (
//                     <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
//                       <div className="flex items-center text-sm">
//                         <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
//                         <span className="font-medium">
//                           {formData.originalFile?.name || formData.selectedFile?.name}
//                         </span>
//                         {formData.selectedFile && (
//                           <span className="ml-2 text-gray-500">
//                             ({formatFileSize(formData.selectedFile.size)})
//                           </span>
//                         )}
//                       </div>
                      
//                       {/* Compression Status */}
//                       {compressionInfo && (
//                         <div className="text-xs bg-white dark:bg-gray-900 rounded p-2 border">
//                           <pre className="whitespace-pre-wrap font-mono text-gray-600 dark:text-gray-400">
//                             {compressionInfo}
//                           </pre>
//                         </div>
//                       )}
//                     </div>
//                   )}
                  
//                   {/* Compression Status */}
//                   {isCompressing && (
//                     <Alert>
//                       <Zap className="h-4 w-4 animate-pulse" />
//                       <AlertDescription>
//                         <div className="flex items-center">
//                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                           Compressing large image for optimal upload... This may take 5-15 seconds.
//                         </div>
//                       </AlertDescription>
//                     </Alert>
//                   )}
                  
//                   {/* Upload Progress */}
//                   {uploadProgress && !isCompressing && (
//                     <Alert>
//                       <CheckCircle className="h-4 w-4" />
//                       <AlertDescription>{uploadProgress}</AlertDescription>
//                     </Alert>
//                   )}
                  
//                   {/* Upload Guidelines */}
//                   <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-950/20 rounded p-2">
//                     <div className="space-y-1">
//                       <p><strong>✨ Smart Upload:</strong> Any size supported - large images auto-compressed</p>
//                       <p><strong>📏 Best Quality:</strong> Upload highest resolution available</p>
//                       <p><strong>🎯 Target:</strong> System compresses to under 8MB for optimal performance</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* ✨ ENHANCED: Dialog Footer */}
//             <div className="flex justify-end space-x-2 pt-4 border-t">
//               <Button 
//                 variant="outline" 
//                 onClick={() => {
//                   setIsCreateModalOpen(false)
//                   resetForm()
//                 }}
//                 disabled={isUploading || isCompressing}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleSubmit}
//                 disabled={isUploading || isCompressing || !formData.selectedFile}
//               >
//                 {isCompressing ? (
//                   <>
//                     <Zap className="h-4 w-4 mr-2 animate-pulse" />
//                     Compressing...
//                   </>
//                 ) : isUploading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Create Slide
//                   </>
//                 )}
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Slider Images Grid - UNCHANGED */}
//       {sliderImages.length === 0 ? (
//         <Card className="text-center py-12">
//           <CardContent>
//             <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//               No slider images yet
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-4">
//               Get started by adding your first slider image.
//             </p>
//             <Button onClick={() => setIsCreateModalOpen(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add First Image
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {sliderImages.map((image, index) => (
//             <Card key={image.id} className="overflow-hidden">
//               <div className="relative h-48">
//                 <Image
//                   src={image.imageUrl}
//                   alt={image.alt || image.title || "Slider image"}
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute top-2 right-2 flex space-x-1">
//                   <Badge variant={image.active ? "default" : "secondary"}>
//                     {image.active ? "Active" : "Inactive"}
//                   </Badge>
//                   <Badge variant="outline">#{index + 1}</Badge>
//                 </div>
//               </div>
              
//               <CardHeader>
//                 <CardTitle className="text-lg">
//                   {image.title || "Untitled Slide"}
//                 </CardTitle>
//                 {image.description && (
//                   <CardDescription>{image.description}</CardDescription>
//                 )}
//               </CardHeader>
              
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       checked={image.active}
//                       onCheckedChange={(checked) => toggleActive(image.id, checked)}
//                     />
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       {image.active ? "Visible" : "Hidden"}
//                     </span>
//                   </div>
                  
//                   <div className="flex space-x-1">
//                     <Button variant="ghost" size="sm">
//                       <Edit className="h-4 w-4" />
//                     </Button>
                    
//                     <AlertDialog>
//                       <AlertDialogTrigger asChild>
//                         <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </AlertDialogTrigger>
//                       <AlertDialogContent>
//                         <AlertDialogHeader>
//                           <AlertDialogTitle>Delete Slider Image</AlertDialogTitle>
//                           <AlertDialogDescription>
//                             Are you sure you want to delete this slider image? This action cannot be undone.
//                           </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                           <AlertDialogCancel>Cancel</AlertDialogCancel>
//                           <AlertDialogAction
//                             onClick={() => deleteSliderImage(image.id)}
//                             className="bg-red-600 hover:bg-red-700"
//                           >
//                             Delete
//                           </AlertDialogAction>
//                         </AlertDialogFooter>
//                       </AlertDialogContent>
//                     </AlertDialog>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }



// src/app/admin/home-slider/page.tsx - FIXED with Auto-Compression
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Loader2,
  Image as ImageIcon,
  Zap,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X,
} from "lucide-react"
import Image from "next/image"

// ✨ CRITICAL: Import compression functions
import { resizeForCloudinary, formatFileSize, needsCompression } from "@/lib/quickResize"

interface SliderImage {
  id: string
  title?: string
  description?: string
  imageUrl: string
  publicId: string
  alt?: string
  order: number
  active: boolean
  linkUrl?: string
  linkText?: string
  createdAt: string
  updatedAt: string
}

export default function AdminHomeSlider() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  // ✨ NEW: Compression states
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState("")
  const [uploadProgress, setUploadProgress] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResults, setVerificationResults] = useState<any[]>([])
  const [showVerification, setShowVerification] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    alt: "",
    linkUrl: "",
    linkText: "",
    active: true,
    selectedFile: null as File | null,
    originalFile: null as File | null // Track original for display
  })

  useEffect(() => {
    fetchSliderImages()
  }, [])

  const fetchSliderImages = async () => {
    try {
      const response = await fetch("/api/home-slider")
      if (response.ok) {
        const data = await response.json()
        setSliderImages(data)
      }
    } catch (error) {
      console.error("Error fetching slider images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // ✨ NEW: Enhanced file selection with auto-compression
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log(`📁 File selected: ${file.name} (${formatFileSize(file.size)})`)
    console.log(`📝 File type: ${file.type}`)
    
    // Store original file for reference
    setFormData(prev => ({
      ...prev,
      originalFile: file,
      selectedFile: null
    }))
    setCompressionInfo("")
    setUploadProgress("")

    // Check if compression is needed
    const needsCompression = file.size > 8 * 1024 * 1024 // 8MB threshold
    const isTiffFile = file.type === 'image/tiff' || file.type === 'image/tif' || 
                       file.name.toLowerCase().endsWith('.tif') || 
                       file.name.toLowerCase().endsWith('.tiff')

    if (isTiffFile) {
      // TIFF files: Skip client compression, let server handle conversion
      console.log(`📝 TIFF file detected: ${file.name}`)
      setFormData(prev => ({
        ...prev,
        selectedFile: file
      }))
      setCompressionInfo(`📝 TIFF File Detected
📁 File: ${file.name} (${formatFileSize(file.size)})
🔄 Server will automatically convert TIFF → JPEG
✅ No client-side processing needed - server handles TIFF conversion
🎯 Ready for upload with automatic conversion!`)
      
    } else if (needsCompression) {
      setIsCompressing(true)
      setCompressionInfo(`🔍 Analyzing ${file.name} (${formatFileSize(file.size)})...`)
      
      try {
        console.log(`🗜️ Large file detected (${formatFileSize(file.size)}), compressing...`)
        
        // Test if the file can be processed
        const testImg = document.createElement('img')
        const imageLoadPromise = new Promise((resolve, reject) => {
          testImg.onload = () => {
            console.log(`✅ Image loaded successfully: ${testImg.width}x${testImg.height}`)
            resolve(true)
          }
          testImg.onerror = (error) => {
            console.log(`❌ Image load failed:`, error)
            reject(new Error(`Cannot load ${file.type} file as image`))
          }
          testImg.src = URL.createObjectURL(file)
        })
        
        // Wait for image to load
        await imageLoadPromise
        URL.revokeObjectURL(testImg.src)
        
        const compressionResult = await resizeForCloudinary(file)
        
        setFormData(prev => ({
          ...prev,
          selectedFile: compressionResult.file
        }))
        
        const savedSpace = compressionResult.originalSize - compressionResult.newSize
        const compressionPercent = (compressionResult.compressionRatio * 100).toFixed(1)
        
        setCompressionInfo(`✅ Compression Complete!
📁 Original: ${file.name} (${formatFileSize(compressionResult.originalSize)})
📦 Compressed: ${formatFileSize(compressionResult.newSize)}
💾 Space Saved: ${formatFileSize(savedSpace)} (${compressionPercent}% reduction)
📏 Dimensions: ${compressionResult.dimensions.width}×${compressionResult.dimensions.height}
🎯 Cloudinary Ready: ${compressionResult.newSize < 10 * 1024 * 1024 ? '✅ YES' : '❌ Still too large'}`)
        
        console.log(`✅ Compression successful: ${formatFileSize(compressionResult.originalSize)} → ${formatFileSize(compressionResult.newSize)}`)
        
      } catch (error) {
        console.error("❌ Compression failed:", error)
        
        let errorMsg = ""
        if (error instanceof Error) {
          if (error.message.includes("Cannot load")) {
            errorMsg = `📝 TIFF File Detected: ${file.type}
📁 File: ${file.name}
✅ Server will automatically convert TIFF → JPEG
🎯 Proceeding with server-side conversion...`
          } else {
            errorMsg = `❌ Compression Failed: ${error.message}`
          }
        } else {
          errorMsg = `❌ Unknown compression error`
        }
        
        setCompressionInfo(`${errorMsg}

📁 Using original file: ${file.name} (${formatFileSize(file.size)})
🚀 Server will handle TIFF conversion automatically`)
        
        // Use original file - server will convert it
        setFormData(prev => ({
          ...prev,
          selectedFile: file
        }))
      } finally {
        setIsCompressing(false)
      }
    } else {
      // Small file - use as-is
      setFormData(prev => ({
        ...prev,
        selectedFile: file
      }))
      setCompressionInfo(`✅ File size acceptable (${formatFileSize(file.size)})
📁 File: ${file.name}
🎯 No compression needed - ready for upload!`)
    }
  }

  // ✨ ENHANCED: handleSubmit with better error handling
  const handleSubmit = async () => {
    if (!formData.selectedFile) {
      alert("Please select an image first")
      return
    }
    
    setIsUploading(true)
    setUploadProgress("🚀 Starting upload...")
    
    try {
      console.log(`🚀 Uploading ${formData.selectedFile.name} (${formatFileSize(formData.selectedFile.size)})`)
      
      // Upload to Cloudinary
      const uploadFormData = new FormData()
      uploadFormData.append("file", formData.selectedFile)
      
      setUploadProgress("☁️ Uploading to Cloudinary...")
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const responseText = await uploadResponse.text()
      
      if (uploadResponse.ok) {
        const uploadData = JSON.parse(responseText)
        console.log("✅ Upload successful:", uploadData)
        
        setUploadProgress("💾 Creating slider entry...")
        
        // Create slider entry
        const sliderData = {
          title: formData.title,
          description: formData.description,
          alt: formData.alt,
          linkUrl: formData.linkUrl,
          linkText: formData.linkText,
          active: formData.active,
          imageUrl: uploadData.url,
          publicId: uploadData.public_id,
          order: sliderImages.length
        }

        const response = await fetch("/api/home-slider", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sliderData),
        })

        if (response.ok) {
          await fetchSliderImages()
          setIsCreateModalOpen(false)
          resetForm()
          alert("🎉 Slider image uploaded successfully!")
        } else {
          const errorData = await response.json()
          throw new Error(`Failed to create slider: ${errorData.error || 'Unknown error'}`)
        }
      } else {
        // Handle upload errors
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { error: responseText }
        }
        
        if (errorData.error === "FILE_TOO_LARGE") {
          throw new Error(`File too large: ${errorData.details?.currentSizeMB}MB. Please try a smaller image or contact support.`)
        }
        
        throw new Error(`Upload failed: ${errorData.error || `Server error ${uploadResponse.status}`}`)
      }
    } catch (error) {
      console.error("❌ Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error'
      alert(`❌ Upload failed: ${errorMessage}`)
      setUploadProgress(`❌ Failed: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  const updateSliderImage = async (id: string, updates: Partial<SliderImage>) => {
    try {
      const response = await fetch(`/api/home-slider/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchSliderImages()
      }
    } catch (error) {
      console.error("Error updating slider image:", error)
    }
  }

  const deleteSliderImage = async (id: string) => {
    try {
      const response = await fetch(`/api/home-slider/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchSliderImages()
        alert("Slider image deleted successfully!")
      } else {
        alert("Failed to delete slider image")
      }
    } catch (error) {
      console.error("Error deleting slider image:", error)
      alert("Error deleting slider image")
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    await updateSliderImage(id, { active })
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      alt: "",
      linkUrl: "",
      linkText: "",
      active: true,
      selectedFile: null,
      originalFile: null
    })
    setEditingImage(null)
    setCompressionInfo("")
    setUploadProgress("")
  }

  // Verify which images exist in Cloudinary
  const verifyImages = async () => {
    setIsVerifying(true)
    setShowVerification(true)
    try {
      const response = await fetch("/api/admin/home-slider/verify", {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setVerificationResults(data.results || [])
      } else {
        console.error("Failed to verify images")
      }
    } catch (error) {
      console.error("Error verifying images:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  // Delete broken image entries
  const deleteBrokenImage = async (id: string) => {
    await deleteSliderImage(id)
    await fetchSliderImages()
    // Remove from verification results
    setVerificationResults(prev => prev.filter(r => r.id !== id))
  }

  // Bulk delete all missing images
  const deleteAllMissing = async () => {
    const missingIds = verificationResults.filter(r => !r.exists).map(r => r.id)
    
    if (missingIds.length === 0) {
      alert("No missing images to delete")
      return
    }

    if (!confirm(`Are you sure you want to delete ${missingIds.length} missing image${missingIds.length !== 1 ? 's' : ''}?`)) {
      return
    }

    try {
      const response = await fetch("/api/admin/home-slider/verify", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: missingIds })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ Successfully deleted ${data.deleted} missing image${data.deleted !== 1 ? 's' : ''}`)
        await fetchSliderImages()
        setVerificationResults(prev => prev.filter(r => r.exists))
      } else {
        const error = await response.json()
        alert(`Failed to delete: ${error.error}`)
      }
    } catch (error) {
      console.error("Error bulk deleting:", error)
      alert("Failed to delete missing images")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Home Page Slider
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage the sliding images on your home page • Auto-compression enabled
          </p>
          {sliderImages.length > 0 && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              {sliderImages.length} image{sliderImages.length !== 1 ? 's' : ''} in database
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          {sliderImages.length > 0 && (
            <Button 
              variant="outline" 
              onClick={verifyImages}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verify Images
                </>
              )}
            </Button>
          )}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Slider Image</DialogTitle>
              <DialogDescription>
                Upload a new image for the home page slider. Large images will be automatically compressed.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter slide title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter slide description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({...formData, alt: e.target.value})}
                  placeholder="Describe the image"
                />
              </div>
              
              <div>
                <Label htmlFor="linkUrl">Link URL (Optional)</Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="linkText">Link Text (Optional)</Label>
                <Input
                  id="linkText"
                  value={formData.linkText}
                  onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                  placeholder="Learn More"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label>Active</Label>
              </div>
              
              {/* ✨ ENHANCED: Image Upload Section */}
              <div>
                <Label>Select Image *</Label>
                <div className="mt-2 space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading || isCompressing}
                    className="mb-2"
                  />
                  
                  {/* File Info Display */}
                  {(formData.selectedFile || formData.originalFile) && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                      <div className="flex items-center text-sm">
                        <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          {formData.originalFile?.name || formData.selectedFile?.name}
                        </span>
                        {formData.selectedFile && (
                          <span className="ml-2 text-gray-500">
                            ({formatFileSize(formData.selectedFile.size)})
                          </span>
                        )}
                      </div>
                      
                      {/* Compression Status */}
                      {compressionInfo && (
                        <div className="text-xs bg-white dark:bg-gray-900 rounded p-2 border">
                          <pre className="whitespace-pre-wrap font-mono text-gray-600 dark:text-gray-400">
                            {compressionInfo}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Compression Status */}
                  {isCompressing && (
                    <Alert>
                      <Zap className="h-4 w-4 animate-pulse" />
                      <AlertDescription>
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Compressing large image for optimal upload... This may take 5-15 seconds.
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Upload Progress */}
                  {uploadProgress && !isCompressing && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{uploadProgress}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Upload Guidelines */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-950/20 rounded p-2">
                    <div className="space-y-1">
                      <p><strong>✨ Smart Upload:</strong> Any size supported - large images auto-compressed</p>
                      <p><strong>📏 Best Quality:</strong> Upload highest resolution available</p>
                      <p><strong>🎯 Target:</strong> System compresses to under 8MB for optimal performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ✨ ENHANCED: Dialog Footer */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateModalOpen(false)
                  resetForm()
                }}
                disabled={isUploading || isCompressing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isUploading || isCompressing || !formData.selectedFile}
              >
                {isCompressing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Compressing...
                  </>
                ) : isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Slide
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Verification Results */}
      {showVerification && verificationResults.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Image Verification Results
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVerification(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {verificationResults.map((result) => (
                <div
                  key={result.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.exists
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.exists ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{result.title || "Untitled"}</p>
                      <p className="text-xs text-gray-500 truncate max-w-md">
                        {result.imageUrl}
                      </p>
                      {result.diagnostic && (
                        <div className="text-xs mt-1 space-y-0.5">
                          <p className={result.diagnostic.urlAccessible ? "text-green-600" : "text-red-600"}>
                            Accessible: {result.diagnostic.urlAccessible ? "Yes" : "No"}
                          </p>
                          <p className={result.diagnostic.isImageType ? "text-green-600" : "text-red-600"}>
                            Image Type: {result.diagnostic.isImageType ? "Yes" : "No"}
                          </p>
                          {result.contentType && (
                            <p className="text-gray-400">Content-Type: {result.contentType}</p>
                          )}
                          {result.diagnostic.hasCors ? (
                            <p className="text-green-600">CORS: Enabled</p>
                          ) : (
                            <p className="text-amber-600">CORS: Not detected (may cause browser issues)</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {!result.exists && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBrokenImage(result.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm">
                  <strong>Summary:</strong> {verificationResults.filter(r => r.exists).length} valid,{" "}
                  {verificationResults.filter(r => !r.exists).length} missing
                </p>
              </div>
              {verificationResults.filter(r => !r.exists).length > 0 && (
                <Button
                  variant="destructive"
                  onClick={deleteAllMissing}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All {verificationResults.filter(r => !r.exists).length} Missing Images
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slider Images Grid - UNCHANGED */}
      {sliderImages.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No slider images yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first slider image.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sliderImages.map((image, index) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={image.imageUrl}
                  alt={image.alt || image.title || "Slider image"}
                  fill
                  className="object-cover"
                  unoptimized={image.imageUrl.includes('cloudinary.com')}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                    // Show error placeholder
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-red-100 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 border-dashed">
                          <div class="text-center text-red-600 dark:text-red-400 p-4">
                            <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <p class="text-xs font-medium">Image Missing</p>
                            <p class="text-xs mt-1">Not found in Cloudinary</p>
                          </div>
                        </div>
                      `
                    }
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Badge variant={image.active ? "default" : "secondary"}>
                    {image.active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">
                  {image.title || "Untitled Slide"}
                </CardTitle>
                {image.description && (
                  <CardDescription>{image.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={image.active}
                      onCheckedChange={(checked) => toggleActive(image.id, checked)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {image.active ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Slider Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this slider image? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteSliderImage(image.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}