import { DebugUploadComponent } from "@/components/admin/DebugUploadComponent"

export default function DebugPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Upload Debug Tool</h1>
        <p className="text-gray-600">
          Step-by-step debugging for large image upload issues
        </p>
      </div>
      
      <DebugUploadComponent galleryId="debug-gallery-123" />
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-2">🎯 What this tool does:</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Tests compression of your large images</li>
          <li>• Shows detailed error messages from upload attempts</li>
          <li>• Helps identify if the issue is compression or server-side</li>
          <li>• Provides downloadable compressed files for manual testing</li>
        </ul>
      </div>
    </div>
  )
}