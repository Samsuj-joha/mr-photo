export default function GalleryLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

