// File: src/components/portfolio/PortfolioPagination.tsx
// Pagination component for portfolio

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PortfolioPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function PortfolioPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PortfolioPaginationProps) {
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1
          const isCurrentPage = page === currentPage
          
          // Show first page, last page, current page, and pages around current page
          const showPage = 
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          
          if (!showPage) {
            // Show ellipsis
            if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="px-2 text-gray-400">...</span>
            }
            return null
          }

          return (
            <Button
              key={page}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-10 h-10"
            >
              {page}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}