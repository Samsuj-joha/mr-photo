// File: src/app/blog-test/page.tsx
// Minimal test to isolate the exact issue

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function BlogTest() {
  const [coverImage, setCoverImage] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  // EXACT same function that works in debug tool
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('🔍 Upload started for:', file.name)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Image must be less than 10MB')
      return
    }

    setIsUploading(true)

    try {
      console.log('🚀 Starting upload test...')
      
      // Create FormData - EXACT same as debug tool
      const formData = new FormData()
      formData.append('file', file)
      console.log('📦 FormData created')

      console.log('📤 Sending POST to /api/blog-upload')
      
      // Use EXACT same fetch as debug tool
      const response = await fetch('/api/blog-upload', {
        method: 'POST',
        body: formData
      })

      console.log(`📨 Response received: ${response.status} (${response.statusText})`)
      console.log(`✅ Response OK: ${response.ok}`)

      if (response.ok) {
        const data = await response.json()
        console.log('🎉 Upload successful!')
        console.log(`🔗 Image URL: ${data.url}`)
        
        // Set the image URL
        setCoverImage(data.url)
        alert('Upload successful!')
        
      } else {
        const errorText = await response.text()
        console.log(`❌ Upload failed: ${errorText}`)
        alert('Upload failed: ' + errorText)
      }
    } catch (error) {
      console.error('💥 Upload error:', error)
      alert('Upload error: ' + error)
    } finally {
      setIsUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Blog Upload Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Upload (Same as Working Debug Tool)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Image Preview */}
          {coverImage && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={coverImage}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Upload Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              {isUploading ? (
                <div>Uploading...</div>
              ) : (
                <>
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                      Click to upload image (Same logic as debug tool)
                    </span>
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600">
            <p><strong>This uses EXACTLY the same code as the working debug tool.</strong></p>
            <p>If this works but your blog form doesn't, there's something wrong with your blog form setup.</p>
            <p>Open browser console (F12) to see detailed logs.</p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}