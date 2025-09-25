// // File: src/components/admin/portfolio/AdminPortfolio.tsx
// // Main portfolio management component for admin panel

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import {
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   Eye,
//   Calendar,
//   MoreHorizontal,
//   Upload,
//   Image as ImageIcon,
//   X
// } from "lucide-react"
// import Image from "next/image"

// interface Portfolio {
//   id: number
//   title: string
//   gallery: string
//   coverImage: string
//   description: string
//   createdAt: string
//   views: number
// }

// export default function AdminPortfolio() {
//   const [portfolios, setPortfolios] = useState<Portfolio[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState("all")
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

//   // Fetch portfolios from API
//   useEffect(() => {
//     const fetchPortfolios = async () => {
//       try {
//         const response = await fetch('/api/admin/portfolios')
//         if (response.ok) {
//           const data = await response.json()
//           setPortfolios(data)
//         }
//       } catch (error) {
//         console.error('Error fetching portfolios:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPortfolios()
//   }, [])

//   // Filter portfolios
//   const filteredPortfolios = portfolios.filter(portfolio => {
//     const matchesSearch = portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          portfolio.description.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesCategory = selectedCategory === "all" || portfolio.gallery === selectedCategory
//     return matchesSearch && matchesCategory
//   })

//   const CreatePortfolioForm = ({ onClose }: { onClose: () => void }) => {
//     const [formData, setFormData] = useState({
//       title: "",
//       description: "",
//       image: null as File | null,
//       gallery: "",
//     })
//     const [errors, setErrors] = useState<Record<string, string>>({})
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [imagePreview, setImagePreview] = useState<string | null>(null)

//     const galleryOptions = [
//       { value: "portraits", label: "Portraits" },
//       { value: "landscape", label: "Landscape" },
//       { value: "abstract", label: "Abstract" }
//     ]

//     const validateForm = () => {
//       const newErrors: Record<string, string> = {}
      
//       if (!formData.title.trim()) {
//         newErrors.title = "Title is required"
//       }
      
//       if (!formData.description.trim()) {
//         newErrors.description = "Description is required"
//       }
      
//       if (!formData.image) {
//         newErrors.image = "Image is required"
//       }
      
//       if (!formData.gallery) {
//         newErrors.gallery = "Gallery filter is required"
//       }

//       setErrors(newErrors)
//       return Object.keys(newErrors).length === 0
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault()
      
//       if (!validateForm()) {
//         return
//       }

//       setIsSubmitting(true)

//       try {
//         // Create FormData for file upload
//         const portfolioFormData = new FormData()
//         portfolioFormData.append('title', formData.title)
//         portfolioFormData.append('description', formData.description)
//         portfolioFormData.append('gallery', formData.gallery)
        
//         if (formData.image) {
//           portfolioFormData.append('image', formData.image)
//         }

//         const response = await fetch('/api/admin/portfolios', {
//           method: 'POST',
//           body: portfolioFormData,
//         })

//         if (response.ok) {
//           const newPortfolio = await response.json()
//           setPortfolios([...portfolios, newPortfolio])
//           onClose()
//         }
//       } catch (error) {
//         console.error('Error creating portfolio:', error)
//       } finally {
//         setIsSubmitting(false)
//       }
//     }

//     const handleInputChange = (field: string, value: string) => {
//       setFormData(prev => ({ ...prev, [field]: value }))
//       // Clear error when user starts typing
//       if (errors[field]) {
//         setErrors(prev => ({ ...prev, [field]: "" }))
//       }
//     }

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0]
//       if (file) {
//         setFormData(prev => ({ ...prev, image: file }))
        
//         // Create preview
//         const reader = new FileReader()
//         reader.onload = (e) => {
//           setImagePreview(e.target?.result as string)
//         }
//         reader.readAsDataURL(file)
        
//         // Clear error
//         if (errors.image) {
//           setErrors(prev => ({ ...prev, image: "" }))
//         }
//       }
//     }

//     const removeImage = () => {
//       setFormData(prev => ({ ...prev, image: null }))
//       setImagePreview(null)
//     }

//     return (
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Title Field */}
//         <div>
//           <Label htmlFor="title">Title *</Label>
//           <Input
//             id="title"
//             value={formData.title}
//             onChange={(e) => handleInputChange("title", e.target.value)}
//             placeholder="Enter portfolio title"
//             className={errors.title ? "border-red-500" : ""}
//             disabled={isSubmitting}
//           />
//           {errors.title && (
//             <p className="text-sm text-red-500 mt-1">{errors.title}</p>
//           )}
//         </div>

//         {/* Description Field */}
//         <div>
//           <Label htmlFor="description">Description *</Label>
//           <Textarea
//             id="description"
//             value={formData.description}
//             onChange={(e) => handleInputChange("description", e.target.value)}
//             placeholder="Describe your portfolio project..."
//             rows={4}
//             className={errors.description ? "border-red-500" : ""}
//             disabled={isSubmitting}
//           />
//           {errors.description && (
//             <p className="text-sm text-red-500 mt-1">{errors.description}</p>
//           )}
//         </div>

//         {/* Image Upload Field */}
//         <div>
//           <Label htmlFor="image">Image Upload *</Label>
//           <div className="mt-2">
//             {!imagePreview ? (
//               <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
//                 errors.image ? "border-red-500" : "border-gray-300"
//               }`}>
//                 <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                 <div className="mt-4">
//                   <label htmlFor="image-upload" className="cursor-pointer">
//                     <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
//                       Click to upload image
//                     </span>
//                     <span className="mt-1 block text-xs text-gray-500">
//                       PNG, JPG, GIF up to 10MB
//                     </span>
//                   </label>
//                   <input
//                     id="image-upload"
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="relative">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                   disabled={isSubmitting}
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//           {errors.image && (
//             <p className="text-sm text-red-500 mt-1">{errors.image}</p>
//           )}
//         </div>

//         {/* Gallery Filter Field */}
//         <div>
//           <Label htmlFor="gallery">Gallery Filter *</Label>
//           <Select 
//             value={formData.gallery} 
//             onValueChange={(value) => handleInputChange("gallery", value)}
//             disabled={isSubmitting}
//           >
//             <SelectTrigger className={errors.gallery ? "border-red-500" : ""}>
//               <SelectValue placeholder="Select gallery type" />
//             </SelectTrigger>
//             <SelectContent>
//               {galleryOptions.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {errors.gallery && (
//             <p className="text-sm text-red-500 mt-1">{errors.gallery}</p>
//           )}
//         </div>

//         <div className="flex justify-end space-x-2 pt-4">
//           <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? (
//               <div className="flex items-center">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Creating...
//               </div>
//             ) : (
//               <>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Portfolio
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     )
//   }

//   const handleDeletePortfolio = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this portfolio?')) {
//       try {
//         const response = await fetch(`/api/admin/portfolios/${id}`, {
//           method: 'DELETE',
//         })

//         if (response.ok) {
//           setPortfolios(portfolios.filter(p => p.id !== id))
//         }
//       } catch (error) {
//         console.error('Error deleting portfolio:', error)
//       }
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Portfolio Management
//           </h1>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Manage your portfolio projects and showcase your best work
//           </p>
//         </div>
        
//         <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//           <DialogTrigger asChild>
//             <Button className="mt-4 sm:mt-0">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Portfolio
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[600px]">
//             <DialogHeader>
//               <DialogTitle>Create New Portfolio</DialogTitle>
//               <DialogDescription>
//                 Add a new portfolio project to showcase your work
//               </DialogDescription>
//             </DialogHeader>
//             <CreatePortfolioForm onClose={() => setIsCreateModalOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
//                 <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Total Projects</p>
//                 <p className="text-2xl font-bold">{portfolios.length}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
//                 <Upload className="h-4 w-4 text-green-600 dark:text-green-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Galleries</p>
//                 <p className="text-2xl font-bold">3</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
//                 <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Total Views</p>
//                 <p className="text-2xl font-bold">{portfolios.reduce((acc, p) => acc + p.views, 0)}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search portfolios..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//           <SelectTrigger className="w-full sm:w-48">
//             <SelectValue placeholder="All Galleries" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Galleries</SelectItem>
//             <SelectItem value="portraits">Portraits</SelectItem>
//             <SelectItem value="landscape">Landscape</SelectItem>
//             <SelectItem value="abstract">Abstract</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Portfolio Grid */}
//       {filteredPortfolios.length > 0 ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredPortfolios.map((portfolio) => (
//             <Card key={portfolio.id} className="group hover:shadow-lg transition-all duration-200">
//               <div className="relative overflow-hidden">
//                 <Image
//                   src={portfolio.coverImage || '/placeholder-image.jpg'}
//                   alt={portfolio.title}
//                   width={400}
//                   height={250}
//                   className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
//                 />
//                 <div className="absolute top-2 left-2 flex gap-2">
//                   <Badge variant="outline" className="capitalize bg-white/90">
//                     {portfolio.gallery}
//                   </Badge>
//                 </div>
//                 <div className="absolute top-2 right-2">
//                   <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
//                     <MoreHorizontal className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
              
//               <CardContent className="p-4">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
//                       {portfolio.title}
//                     </h3>
//                     <p className="text-xs text-gray-400 capitalize">
//                       {portfolio.gallery}
//                     </p>
//                   </div>
//                 </div>
                
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
//                   {portfolio.description}
//                 </p>
                
//                 <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
//                   <div className="flex items-center">
//                     <Calendar className="h-3 w-3 mr-1" />
//                     {new Date(portfolio.createdAt).toLocaleDateString()}
//                   </div>
//                   <span>{portfolio.views} views</span>
//                 </div>
                
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" className="flex-1">
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                   <Button variant="outline" size="sm" className="flex-1">
//                     <Eye className="h-4 w-4 mr-2" />
//                     View
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     className="text-red-600 hover:text-red-700"
//                     onClick={() => handleDeletePortfolio(portfolio.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
//             <ImageIcon className="h-8 w-8 text-gray-400" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//             No portfolios found
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400 mb-4">
//             {searchQuery || selectedCategory !== "all" 
//               ? "Try adjusting your search or filter criteria."
//               : "Get started by creating your first portfolio project."
//             }
//           </p>
//           {!searchQuery && selectedCategory === "all" && (
//             <Button onClick={() => setIsCreateModalOpen(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Create Your First Portfolio
//             </Button>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }



// File: src/components/admin/portfolio/AdminPortfolio.tsx
// Complete portfolio management component for admin panel with embedded form

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MoreHorizontal,
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileImage,
  Zap
} from "lucide-react"
import Image from "next/image"

interface Portfolio {
  id: string
  title: string
  gallery: string
  coverImage: string
  description: string
  createdAt: string
  views: number
}

interface UploadProgress {
  stage: string
  progress: number
  message: string
  details?: any
}

export default function AdminPortfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  // Fetch portfolios from API
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/admin/portfolios')
        if (response.ok) {
          const data = await response.json()
          setPortfolios(data)
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  // Filter portfolios
  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesSearch = portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || portfolio.gallery === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Embedded Portfolio Form Component
  const CreatePortfolioForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: null as File | null,
      gallery: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

    const galleryOptions = [
      { value: "portraits", label: "Portraits" },
      { value: "landscape", label: "Landscape" },
      { value: "abstract", label: "Abstract" },
      { value: "wedding", label: "Wedding" },
      { value: "street", label: "Street Photography" },
      { value: "commercial", label: "Commercial" }
    ]

    const validateForm = () => {
      const newErrors: Record<string, string> = {}
      
      if (!formData.title.trim()) {
        newErrors.title = "Title is required"
      }
      
      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      }
      
      if (!formData.image) {
        newErrors.image = "Image is required"
      }
      
      if (!formData.gallery) {
        newErrors.gallery = "Gallery category is required"
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!validateForm()) {
        return
      }

      setIsSubmitting(true)
      setUploadProgress({
        stage: "preparing",
        progress: 0,
        message: "Preparing upload..."
      })

      try {
        // Create FormData for file upload
        const portfolioFormData = new FormData()
        portfolioFormData.append('title', formData.title)
        portfolioFormData.append('description', formData.description)
        portfolioFormData.append('gallery', formData.gallery)
        
        if (formData.image) {
          portfolioFormData.append('image', formData.image)
          
          // Show file analysis
          const isTiff = formData.image.type === 'image/tiff' || 
                        formData.image.type === 'image/tif' || 
                        formData.image.name.toLowerCase().endsWith('.tif') || 
                        formData.image.name.toLowerCase().endsWith('.tiff')
          
          const isLarge = formData.image.size > 10 * 1024 * 1024
          const fileSizeMB = (formData.image.size / (1024 * 1024)).toFixed(2)
          
          if (isTiff) {
            setUploadProgress({
              stage: "converting",
              progress: 20,
              message: `Converting TIFF file (${fileSizeMB}MB) to JPEG...`,
              details: { originalFormat: "TIFF", targetFormat: "JPEG" }
            })
          } else if (isLarge) {
            setUploadProgress({
              stage: "optimizing",
              progress: 20,
              message: `Optimizing large file (${fileSizeMB}MB)...`,
              details: { originalSize: fileSizeMB + "MB" }
            })
          } else {
            setUploadProgress({
              stage: "uploading",
              progress: 30,
              message: "Uploading to cloud storage..."
            })
          }
        }

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (!prev) return null
            const newProgress = Math.min(prev.progress + 15, 85)
            
            if (prev.stage === "converting" && newProgress > 50) {
              return {
                stage: "uploading",
                progress: newProgress,
                message: "Uploading converted image to cloud..."
              }
            }
            
            if (prev.stage === "optimizing" && newProgress > 50) {
              return {
                stage: "uploading",
                progress: newProgress,
                message: "Uploading optimized image to cloud..."
              }
            }
            
            return {
              ...prev,
              progress: newProgress
            }
          })
        }, 800)

        const response = await fetch('/api/admin/portfolios', {
          method: 'POST',
          body: portfolioFormData,
        })

        clearInterval(progressInterval)

        if (response.ok) {
          const newPortfolio = await response.json()
          
          setUploadProgress({
            stage: "complete",
            progress: 100,
            message: newPortfolio.message || "Portfolio created successfully!",
            details: newPortfolio.uploadDetails
          })
          
          // Add to portfolios list
          setPortfolios(prev => [newPortfolio, ...prev])
          
          // Close after a short delay to show success
          setTimeout(() => {
            onClose()
            setUploadProgress(null)
          }, 2000)
          
        } else {
          const errorData = await response.json()
          clearInterval(progressInterval)
          
          setUploadProgress({
            stage: "error",
            progress: 0,
            message: errorData.message || "Upload failed",
            details: errorData.details
          })
        }
      } catch (error) {
        console.error('Error creating portfolio:', error)
        setUploadProgress({
          stage: "error",
          progress: 0,
          message: "Network error occurred",
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }))
      }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setFormData(prev => ({ ...prev, image: file }))
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
        
        // Clear error
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: "" }))
        }
      }
    }

    const removeImage = () => {
      setFormData(prev => ({ ...prev, image: null }))
      setImagePreview(null)
    }

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB'
      }
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }

    const getFileTypeInfo = (file: File) => {
      const isTiff = file.type === 'image/tiff' || 
                    file.type === 'image/tif' || 
                    file.name.toLowerCase().endsWith('.tif') || 
                    file.name.toLowerCase().endsWith('.tiff')
      
      const isLarge = file.size > 10 * 1024 * 1024
      
      return { isTiff, isLarge }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter portfolio title"
            className={errors.title ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your portfolio project..."
            rows={4}
            className={errors.description ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Image Upload Field */}
        <div>
          <Label htmlFor="image">Portfolio Cover Image *</Label>
          <div className="mt-2">
            {!imagePreview ? (
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Click to upload portfolio image
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, TIFF, WebP up to 50MB
                    </span>
                    <span className="mt-1 block text-xs text-blue-600">
                      ✨ TIFF files will be automatically converted to JPEG
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.tif,.tiff"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* File Info */}
                {formData.image && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <FileImage className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{formData.image.name}</span>
                      </div>
                      <span className="text-gray-500">{formatFileSize(formData.image.size)}</span>
                    </div>
                    
                    {(() => {
                      const { isTiff, isLarge } = getFileTypeInfo(formData.image!)
                      return (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {isTiff && (
                            <div className="flex items-center text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              <Zap className="h-3 w-3 mr-1" />
                              Will convert TIFF → JPEG
                            </div>
                          )}
                          {isLarge && (
                            <div className="flex items-center text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                              <Zap className="h-3 w-3 mr-1" />
                              Will optimize large file
                            </div>
                          )}
                          {!isTiff && !isLarge && (
                            <div className="flex items-center text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready to upload
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
          {errors.image && (
            <p className="text-sm text-red-500 mt-1">{errors.image}</p>
          )}
        </div>

        {/* Gallery Category Field */}
        <div>
          <Label htmlFor="gallery">Gallery Category *</Label>
          <Select 
            value={formData.gallery} 
            onValueChange={(value) => handleInputChange("gallery", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.gallery ? "border-red-500" : ""}>
              <SelectValue placeholder="Select gallery category" />
            </SelectTrigger>
            <SelectContent>
              {galleryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gallery && (
            <p className="text-sm text-red-500 mt-1">{errors.gallery}</p>
          )}
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <Alert className={`${
            uploadProgress.stage === "error" ? "border-red-500 bg-red-50 dark:bg-red-950" :
            uploadProgress.stage === "complete" ? "border-green-500 bg-green-50 dark:bg-green-950" :
            "border-blue-500 bg-blue-50 dark:bg-blue-950"
          }`}>
            <div className="flex items-center space-x-2">
              {uploadProgress.stage === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : uploadProgress.stage === "complete" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
              <AlertDescription className="flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{uploadProgress.message}</span>
                    <span className="text-sm text-gray-500">{uploadProgress.progress}%</span>
                  </div>
                  
                  {uploadProgress.stage !== "error" && uploadProgress.stage !== "complete" && (
                    <Progress value={uploadProgress.progress} className="w-full" />
                  )}
                  
                  {uploadProgress.details && uploadProgress.stage === "complete" && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {uploadProgress.details.wasConverted && (
                        <div>✅ Converted from {uploadProgress.details.originalFormat} to {uploadProgress.details.finalFormat}</div>
                      )}
                      {uploadProgress.details.wasOptimized && (
                        <div>🎯 Optimized: {(uploadProgress.details.originalSize / 1024 / 1024).toFixed(2)}MB → {(uploadProgress.details.finalSize / 1024 / 1024).toFixed(2)}MB</div>
                      )}
                      {uploadProgress.details.dimensions && (
                        <div>📐 Dimensions: {uploadProgress.details.dimensions}</div>
                      )}
                    </div>
                  )}
                  
                  {uploadProgress.details && uploadProgress.stage === "error" && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                      {typeof uploadProgress.details === 'string' ? uploadProgress.details : JSON.stringify(uploadProgress.details)}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Form Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || uploadProgress?.stage === "complete"}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {uploadProgress?.stage === "converting" ? "Converting..." :
                 uploadProgress?.stage === "optimizing" ? "Optimizing..." :
                 uploadProgress?.stage === "uploading" ? "Uploading..." :
                 "Processing..."}
              </div>
            ) : uploadProgress?.stage === "complete" ? (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Created Successfully!
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Portfolio
              </>
            )}
          </Button>
        </div>
      </form>
    )
  }

  const handleDeletePortfolio = async (id: string) => {
    const portfolio = portfolios.find(p => p.id === id)
    const confirmMessage = `Are you sure you want to delete "${portfolio?.title}"?\n\nThis will also remove the image from cloud storage and cannot be undone.`
    
    if (window.confirm(confirmMessage)) {
      setDeleteLoading(id)
      try {
        const response = await fetch(`/api/admin/portfolios/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setPortfolios(portfolios.filter(p => p.id !== id))
        } else {
          const errorData = await response.json()
          alert(`Failed to delete portfolio: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Error deleting portfolio:', error)
        alert('Failed to delete portfolio. Please try again.')
      } finally {
        setDeleteLoading(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Portfolio Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your portfolio projects and showcase your best work
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Add a new portfolio project to showcase your work. TIFF files will be automatically converted to JPEG.
              </DialogDescription>
            </DialogHeader>
            <CreatePortfolioForm onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Info Banner */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <Zap className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Enhanced Upload System:</strong> Supports TIFF files (auto-converted to JPEG), automatic image optimization for large files, and smart compression to ensure fast loading times.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Projects</p>
                <p className="text-2xl font-bold">{portfolios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-2xl font-bold">{portfolios.filter(p => p.gallery).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold">{portfolios.reduce((acc, p) => acc + p.views, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold">{new Set(portfolios.map(p => p.gallery)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search portfolios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="portraits">Portraits</SelectItem>
            <SelectItem value="landscape">Landscape</SelectItem>
            <SelectItem value="abstract">Abstract</SelectItem>
            <SelectItem value="wedding">Wedding</SelectItem>
            <SelectItem value="street">Street Photography</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Grid */}
      {filteredPortfolios.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPortfolios.map((portfolio) => (
            <Card key={portfolio.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="relative overflow-hidden">
                <Image
                  src={portfolio.coverImage || '/placeholder-image.jpg'}
                  alt={portfolio.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge variant="outline" className="capitalize bg-white/90 backdrop-blur-sm">
                    {portfolio.gallery}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                      {portfolio.title}
                    </h3>
                    <p className="text-xs text-gray-400 capitalize">
                      {portfolio.gallery}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {portfolio.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(portfolio.createdAt).toLocaleDateString()}
                  </div>
                  <span>{portfolio.views} views</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeletePortfolio(portfolio.id)}
                    disabled={deleteLoading === portfolio.id}
                  >
                    {deleteLoading === portfolio.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No portfolios found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first portfolio project."
            }
          </p>
          {!searchQuery && selectedCategory === "all" && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Portfolio
            </Button>
          )}
        </div>
      )}
    </div>
  )
}