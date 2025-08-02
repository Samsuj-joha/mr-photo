// File: src/app/admin/blog/debug-page.tsx
// Debug version of blog admin with detailed logging

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"

export default function DebugBlogAdmin() {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    coverImage: "",
    featured: false,
    published: false,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadLogs, setUploadLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = `[${timestamp}] ${message}`
    setUploadLogs(prev => [...prev, logEntry])
    console.log(logEntry)
  }

  const clearLogs = () => {
    setUploadLogs([])
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    clearLogs()
    addLog(`🔍 Upload started for: ${file.name}`)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addLog(`❌ Invalid file type: ${file.type}`)
      alert('Please select an image file')
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      addLog(`❌ File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      alert('Image must be less than 10MB')
      return
    }

    addLog(`✅ File validation passed`)
    addLog(`📊 File details: ${file.name}, ${(file.size / 1024 / 1024).toFixed(2)}MB, ${file.type}`)

    setIsUploading(true)
    setUploadProgress(0)

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file)
    setFormData(prevData => ({ ...prevData, coverImage: previewUrl }))
    addLog(`🖼️ Preview created: ${previewUrl.substring(0, 50)}...`)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      addLog(`📦 FormData created with file`)

      // Progress simulation
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += 10
        if (progress <= 80) {
          setUploadProgress(progress)
          addLog(`📈 Upload progress: ${progress}%`)
        }
      }, 200)

      addLog(`📤 Sending POST request to /api/admin/blogs/upload`)
      
      const response = await fetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: uploadFormData
      })

      clearInterval(progressInterval)
      setUploadProgress(90)
      
      addLog(`📨 Response received: ${response.status} ${response.statusText}`)
      addLog(`🔍 Response OK: ${response.ok}`)

      const responseText = await response.text()
      addLog(`📄 Raw response text: ${responseText.substring(0, 200)}...`)

      if (response.ok) {
        try {
          const data = JSON.parse(responseText)
          addLog(`✅ JSON parsed successfully`)
          addLog(`🔗 Upload URL: ${data.url}`)
          
          setUploadProgress(100)
          
          // Replace preview with actual Cloudinary URL
          URL.revokeObjectURL(previewUrl)
          setFormData(prevData => ({ ...prevData, coverImage: data.url }))
          
          addLog(`🎉 Upload completed successfully!`)
          
        } catch (parseError) {
          addLog(`❌ JSON parse error: ${parseError}`)
          addLog(`📄 Response was: ${responseText}`)
        }
      } else {
        addLog(`❌ Upload failed with status: ${response.status}`)
        
        try {
          const errorData = JSON.parse(responseText)
          addLog(`🔍 Error details: ${JSON.stringify(errorData, null, 2)}`)
        } catch {
          addLog(`📄 Error response (not JSON): ${responseText}`)
        }
      }
    } catch (error) {
      addLog(`💥 Network/Fetch error: ${error}`)
      addLog(`🔍 Error type: ${typeof error}`)
      addLog(`🔍 Error message: ${error instanceof Error ? error.message : 'Unknown'}`)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      e.target.value = ''
      addLog(`🏁 Upload process completed`)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Debug Blog Upload</h1>
      
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Image Upload Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Current Image Preview */}
            {formData.coverImage && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src={formData.coverImage}
                  alt="Cover image preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (formData.coverImage.startsWith('blob:')) {
                        URL.revokeObjectURL(formData.coverImage)
                      }
                      setFormData(prevData => ({ ...prevData, coverImage: "" }))
                      addLog(`🗑️ Image preview cleared`)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div className="mb-2">
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Test Form Fields */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Test blog post"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Test content"
                  rows={3}
                />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Debug Logs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Debug Logs</CardTitle>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              Clear Logs
            </Button>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-xs">
              {uploadLogs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Upload an image to see debug info.</p>
              ) : (
                uploadLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open browser DevTools (F12) → Console tab</li>
            <li>Select an image file using the upload area above</li>
            <li>Watch both the Debug Logs panel and browser console</li>
            <li>Check the Network tab in DevTools for the actual HTTP request</li>
            <li>Look for any error messages in red</li>
          </ol>
        </CardContent>
      </Card>

    </div>
  )
}