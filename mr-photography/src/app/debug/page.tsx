// Add this to your debug page

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function RefreshCheck() {
  const [galleryData, setGalleryData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkCurrentStatus = async () => {
    setLoading(true)
    try {
      // Check main galleries list
      const galleriesResponse = await fetch('/api/gallery')
      const galleries = await galleriesResponse.json()
      
      console.log('📊 Current galleries:', galleries)
      
      if (galleries.length > 0) {
        const gallery = galleries[0] // Get first gallery
        
        // Check individual gallery details
        const galleryResponse = await fetch(`/api/gallery/${gallery.id}`)
        const galleryDetails = await galleryResponse.json()
        
        setGalleryData({
          mainList: gallery,
          details: galleryDetails,
          hasImages: galleryDetails.imageCount > 0,
          timestamp: new Date().toLocaleTimeString()
        })
      }
    } catch (error) {
      console.error('Error checking status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">🔄 Current Status Check</h3>
        <Button onClick={checkCurrentStatus} disabled={loading} size="sm">
          {loading ? "Checking..." : "Refresh Check"}
        </Button>
      </div>

      {galleryData && (
        <div className="space-y-3 text-sm">
          <p><strong>Last checked:</strong> {galleryData.timestamp}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Main Gallery List */}
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">📋 Main Gallery List</h4>
              <p><strong>Title:</strong> {galleryData.mainList.title}</p>
              <p><strong>Image Count:</strong> {galleryData.mainList.imageCount}</p>
              <p><strong>Cover Image:</strong> {galleryData.mainList.coverImage ? '✅ Yes' : '❌ No'}</p>
              {galleryData.mainList.coverImage && (
                <div className="mt-2">
                  <p className="text-xs">Testing cover image:</p>
                  <img 
                    src={galleryData.mainList.coverImage} 
                    alt="Cover test"
                    className="w-16 h-16 object-cover border mt-1"
                    onLoad={() => console.log('✅ Cover image loaded')}
                    onError={(e) => {
                      console.error('❌ Cover image failed')
                      e.currentTarget.style.border = '2px solid red'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gallery Details */}
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">🖼️ Gallery Details</h4>
              <p><strong>Image Count:</strong> {galleryData.details.imageCount}</p>
              <p><strong>Actual Images:</strong> {galleryData.details.images?.length || 0}</p>
              
              {galleryData.details.images?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs">First image:</p>
                  <p className="text-xs break-all">{galleryData.details.images[0].url}</p>
                  <img 
                    src={galleryData.details.images[0].url} 
                    alt="First image test"
                    className="w-16 h-16 object-cover border mt-1"
                    onLoad={() => console.log('✅ First image loaded')}
                    onError={(e) => {
                      console.error('❌ First image failed')
                      e.currentTarget.style.border = '2px solid red'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={`p-3 rounded ${galleryData.hasImages ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
            {galleryData.hasImages ? 
              '✅ Gallery has images! They should now appear in your admin panel and main website.' : 
              '⚠️ Gallery still shows 0 images. There may be a caching issue.'
            }
          </div>
        </div>
      )}
    </div>
  )
}