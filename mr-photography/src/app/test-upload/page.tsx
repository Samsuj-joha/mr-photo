// File: /src/app/test-upload/page.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError("")
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Uploading file:', file.name)
      
      const response = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log('Response:', data)

      if (response.ok) {
        setResult(data)
        console.log('Upload successful:', data)
      } else {
        setError(data.error || 'Upload failed')
        console.error('Upload failed:', data)
      }
    } catch (error) {
      setError('Network error: ' + (error as Error).message)
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>🧪 Test Cloudinary Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Image File
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {file.name} ({Math.round(file.size / 1024)}KB)
              </p>
            )}
          </div>
          
          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload to Cloudinary'}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              ❌ <strong>Error:</strong> {error}
            </div>
          )}

          {/* Success Display */}
          {result && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                ✅ <strong>Upload successful!</strong>
              </div>
              
              <div className="relative w-full h-48 border rounded overflow-hidden">
                <Image
                  src={result.url}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="text-xs bg-gray-50 p-3 rounded space-y-1">
                <p><strong>URL:</strong> <a href={result.url} target="_blank" className="text-blue-600 break-all">{result.url}</a></p>
                <p><strong>Public ID:</strong> {result.publicId}</p>
                <p><strong>Dimensions:</strong> {result.width} x {result.height}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p><strong>Testing Cloudinary Integration</strong></p>
            <p>Cloud Name: dwbgogzbd</p>
            <p>This page tests image upload to Cloudinary.</p>
            <p>⚠️ Delete this page after testing is complete.</p>
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}