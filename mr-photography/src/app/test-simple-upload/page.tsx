// File: src/app/test-simple-upload/page.tsx
// Simple upload test page to debug the upload issue

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimpleUploadTest() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
      console.log('📁 File selected:', {
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        type: selectedFile.type
      })
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🚀 Starting simple upload test...')
      
      const formData = new FormData()
      formData.append('file', file)

      console.log('📤 Sending to API...')
      const response = await fetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: formData
      })

      console.log('📨 Response status:', response.status)
      
      const responseText = await response.text()
      console.log('📄 Raw response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (response.ok) {
        setResult(data)
        console.log('✅ Upload successful!')
      } else {
        setError(`Error: ${data.error || 'Upload failed'}`)
        console.log('❌ Upload failed:', data)
      }
    } catch (err) {
      console.error('💥 Network error:', err)
      setError(`Network error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Simple Upload Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Image File:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Selected File Info */}
          {file && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Selected File:</h3>
              <p><strong>Name:</strong> {file.name}</p>
              <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {file.type}</p>
            </div>
          )}

          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? 'Uploading...' : 'Upload to Cloudinary'}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">Error:</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Upload Successful!</h3>
              <div className="space-y-2 text-sm text-green-600">
                <p><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline break-all">{result.url}</a></p>
                <p><strong>Public ID:</strong> {result.publicId}</p>
                <p><strong>Dimensions:</strong> {result.width} x {result.height}</p>
              </div>
              
              {/* Show uploaded image */}
              {result.url && (
                <div className="mt-4">
                  <img 
                    src={result.url} 
                    alt="Uploaded" 
                    className="max-w-xs h-auto rounded border"
                  />
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Debug Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-600 space-y-1">
              <li>Open browser DevTools (F12)</li>
              <li>Go to Console tab</li>
              <li>Select an image file above</li>
              <li>Click "Upload to Cloudinary"</li>
              <li>Watch console for detailed logs</li>
              <li>Check Network tab for request details</li>
            </ol>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}