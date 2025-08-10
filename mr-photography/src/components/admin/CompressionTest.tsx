"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { resizeForCloudinary, formatFileSize } from "@/lib/quickResize"

export function CompressionTest() {
  const [result, setResult] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [testFile, setTestFile] = useState<File | null>(null)

  const testCompression = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setTestFile(file)
    setIsProcessing(true)
    setResult(`🔄 Testing compression for ${file.name} (${formatFileSize(file.size)})...`)

    try {
      const startTime = Date.now()
      const compressionResult = await resizeForCloudinary(file)
      const endTime = Date.now()
      
      setResult(`
✅ COMPRESSION TEST SUCCESSFUL!

📁 Original File: ${file.name}
📦 Original Size: ${formatFileSize(compressionResult.originalSize)}
📦 Compressed Size: ${formatFileSize(compressionResult.newSize)}
💾 Space Saved: ${formatFileSize(compressionResult.originalSize - compressionResult.newSize)} (${(compressionResult.compressionRatio * 100).toFixed(1)}%)
📏 Dimensions: ${compressionResult.dimensions.width}×${compressionResult.dimensions.height}
⏱️ Processing Time: ${((endTime - startTime) / 1000).toFixed(2)} seconds
🎯 Cloudinary Ready: ${compressionResult.newSize < 10 * 1024 * 1024 ? '✅ YES (Under 10MB)' : '❌ NO (Still over 10MB)'}

${compressionResult.newSize < 10 * 1024 * 1024 ? 
  '🚀 This file is ready for Cloudinary upload!' : 
  '⚠️ File still too large - may need manual intervention'
}
      `)
    } catch (error) {
      setResult(`❌ COMPRESSION FAILED:
${error instanceof Error ? error.message : 'Unknown error'}

This might indicate:
- Canvas API not supported
- File format issues
- Memory limitations
- Browser compatibility issues`)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadCompressedFile = () => {
    if (!testFile) return
    
    resizeForCloudinary(testFile).then(result => {
      const url = URL.createObjectURL(result.file)
      const a = document.createElement('a')
      a.href = url
      a.download = result.file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Compression Test Tool
          <span className="text-sm font-normal text-gray-500">(For debugging upload issues)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select a large image to test compression:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={testCompression}
            disabled={isProcessing}
            className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded-md file:border-0 
                     file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-700 
                     hover:file:bg-blue-100
                     disabled:opacity-50"
          />
        </div>
        
        {result && (
          <div className="space-y-3">
            <pre className="text-xs bg-gray-100 p-4 rounded-lg whitespace-pre-wrap overflow-auto max-h-96 font-mono">
              {result}
            </pre>
            
            {testFile && !isProcessing && result.includes('✅ COMPRESSION TEST SUCCESSFUL') && (
              <div className="flex gap-2">
                <Button 
                  onClick={downloadCompressedFile}
                  size="sm"
                  variant="outline"
                >
                  📥 Download Compressed File
                </Button>
                <Button 
                  onClick={() => {
                    setResult("")
                    setTestFile(null)
                  }}
                  size="sm"
                  variant="outline"
                >
                  🔄 Test Another File
                </Button>
              </div>
            )}
          </div>
        )}
        
        {isProcessing && (
          <div className="text-blue-600 text-sm bg-blue-50 p-3 rounded-lg">
            🔄 Processing... This may take 5-15 seconds for very large images.
          </div>
        )}
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>💡 How to use this test:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Upload a large image (20MB+)</li>
            <li>Check if compression succeeds and results in &lt;10MB</li>
            <li>If successful, your ImageUpload component should work</li>
            <li>If failed, check browser console for detailed errors</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

// Usage: Add this to your admin page to test
// import { CompressionTest } from "@/components/admin/CompressionTest"