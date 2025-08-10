"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { resizeForCloudinary, formatFileSize } from "@/lib/quickResize"

interface DebugUploadComponentProps {
  galleryId?: string
}

export function DebugUploadComponent({ galleryId = "test-gallery-123" }: DebugUploadComponentProps) {
  const [file, setFile] = useState<File | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<string>("")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setCompressedFile(null)
      setResult("")
      console.log("📁 File selected:", selectedFile.name, formatFileSize(selectedFile.size))
    }
  }

  const compressFile = async () => {
    if (!file) return

    setIsCompressing(true)
    setResult("🔄 Starting compression...")

    try {
      console.log("🎯 Starting compression for:", file.name, formatFileSize(file.size))
      
      const compressionResult = await resizeForCloudinary(file)
      
      setCompressedFile(compressionResult.file)
      setResult(`✅ COMPRESSION SUCCESSFUL!

📁 Original File: ${file.name}
📦 Original Size: ${formatFileSize(compressionResult.originalSize)}
📦 Compressed Size: ${formatFileSize(compressionResult.newSize)}
💾 Space Saved: ${formatFileSize(compressionResult.originalSize - compressionResult.newSize)} (${(compressionResult.compressionRatio * 100).toFixed(1)}%)
📏 Dimensions: ${compressionResult.dimensions.width}×${compressionResult.dimensions.height}
🎯 Cloudinary Ready: ${compressionResult.newSize < 10 * 1024 * 1024 ? '✅ YES (Under 10MB)' : '❌ NO (Still over 10MB)'}

${compressionResult.newSize < 10 * 1024 * 1024 ? 
  '🚀 This file should work with Cloudinary!' : 
  '⚠️ File still too large - needs more compression'
}`)
      
      console.log("✅ Compression result:", compressionResult)
    } catch (error) {
      console.error("❌ Compression failed:", error)
      setResult(`❌ COMPRESSION FAILED:
${error instanceof Error ? error.message : 'Unknown error'}

This might indicate:
- Canvas API not supported
- File format issues  
- Memory limitations
- Browser compatibility issues`)
    } finally {
      setIsCompressing(false)
    }
  }

  const uploadFile = async () => {
    if (!compressedFile) return

    setIsUploading(true)
    setResult(prev => prev + "\n\n🚀 STARTING UPLOAD...")

    try {
      console.log("🚀 Starting upload:", compressedFile.name, formatFileSize(compressedFile.size))
      
      const formData = new FormData()
      formData.append("file", compressedFile)
      formData.append("galleryId", galleryId)
      formData.append("alt", "Debug test image")
      formData.append("caption", "Uploaded via debug tool")

      console.log("📋 FormData contents:")
      console.log("- File:", compressedFile.name, formatFileSize(compressedFile.size))
      console.log("- Gallery ID:", galleryId)
      console.log("- File type:", compressedFile.type)

      setResult(prev => prev + `\n📦 Uploading: ${compressedFile.name} (${formatFileSize(compressedFile.size)})`)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log("📡 Raw response:", responseText)

      if (response.ok) {
        try {
          const uploadedImage = JSON.parse(responseText)
          console.log("✅ Upload successful:", uploadedImage)
          setResult(prev => prev + `\n\n✅ UPLOAD SUCCESSFUL!
🆔 Image ID: ${uploadedImage.id}
🔗 URL: ${uploadedImage.url}
📁 Gallery: ${uploadedImage.galleryId}`)
        } catch (parseError) {
          setResult(prev => prev + `\n\n✅ Upload seems successful but response parsing failed: ${responseText}`)
        }
      } else {
        console.error("❌ Upload failed with status:", response.status)
        console.error("❌ Response text:", responseText)
        
        let errorMessage = responseText
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = JSON.stringify(errorData, null, 2)
        } catch {
          // Use raw text if not JSON
        }
        
        setResult(prev => prev + `\n\n❌ UPLOAD FAILED (${response.status}):
${errorMessage}`)
      }
    } catch (error) {
      console.error("❌ Upload error:", error)
      setResult(prev => prev + `\n\n❌ UPLOAD ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const downloadCompressed = () => {
    if (!compressedFile) return
    
    const url = URL.createObjectURL(compressedFile)
    const a = document.createElement('a')
    a.href = url
    a.download = compressedFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const testWithoutGallery = async () => {
    if (!compressedFile) return

    setIsUploading(true)
    setResult(prev => prev + "\n\n🧪 TESTING WITHOUT GALLERY ID...")

    try {
      const formData = new FormData()
      formData.append("file", compressedFile)
      // Don't include galleryId to test if that's the issue
      formData.append("alt", "Test upload without gallery")
      formData.append("caption", "Debug test")

      const response = await fetch("/api/upload", {
        method: "POST", 
        body: formData,
      })

      const responseText = await response.text()
      console.log("🧪 Test response:", response.status, responseText)
      
      setResult(prev => prev + `\n\n🧪 Test without gallery result: ${response.status}
${responseText}`)
    } catch (error) {
      setResult(prev => prev + `\n\n🧪 Test failed: ${error}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🛠️ Debug Upload Tool
          <span className="text-sm font-normal text-gray-500">(Step-by-step debugging)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <strong>Step 1:</strong> Select your large image file (the one that was failing):
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <p className="text-sm">📁 <strong>Selected:</strong> {file.name}</p>
              <p className="text-sm">📦 <strong>Size:</strong> {formatFileSize(file.size)}</p>
              <p className="text-sm">🎭 <strong>Type:</strong> {file.type}</p>
            </div>
          )}
        </div>

        {/* Compression Step */}
        {file && (
          <div>
            <label className="block text-sm font-medium mb-2">
              <strong>Step 2:</strong> Test compression:
            </label>
            <div className="flex gap-2">
              <Button 
                onClick={compressFile} 
                disabled={isCompressing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCompressing ? "🔄 Compressing..." : "🗜️ Compress Image"}
              </Button>
              {compressedFile && (
                <Button onClick={downloadCompressed} variant="outline">
                  📥 Download Compressed
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Upload Step */}
        {compressedFile && (
          <div>
            <label className="block text-sm font-medium mb-2">
              <strong>Step 3:</strong> Test upload to Cloudinary:
            </label>
            <div className="flex gap-2">
              <Button 
                onClick={uploadFile} 
                disabled={isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUploading ? "🚀 Uploading..." : "⬆️ Upload to Cloudinary"}
              </Button>
              <Button 
                onClick={testWithoutGallery} 
                disabled={isUploading}
                variant="outline"
              >
                🧪 Test Without Gallery ID
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <label className="block text-sm font-medium mb-2">
              <strong>Results & Logs:</strong>
            </label>
            <pre className="text-xs bg-gray-100 p-4 rounded-lg whitespace-pre-wrap overflow-auto max-h-96 font-mono border">
              {result}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <strong>💡 Debugging Steps:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li><strong>Compression Test:</strong> If this fails, the issue is with the compression utility</li>
            <li><strong>Upload Test:</strong> If compression works but upload fails, it's a server/API issue</li>
            <li><strong>Check Browser Console:</strong> Look for detailed error logs</li>
            <li><strong>Check Server Logs:</strong> Look at your terminal for API errors</li>
          </ol>
        </div>

        {/* System Info */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border">
          <strong>🔧 Debug Info:</strong>
          <p><strong>Gallery ID:</strong> {galleryId}</p>
          <p><strong>Upload URL:</strong> /api/upload</p>
          <p><strong>Canvas Support:</strong> {typeof HTMLCanvasElement !== 'undefined' ? '✅ Yes' : '❌ No'}</p>
          <p><strong>File API Support:</strong> {typeof File !== 'undefined' ? '✅ Yes' : '❌ No'}</p>
        </div>
      </CardContent>
    </Card>
  )
}