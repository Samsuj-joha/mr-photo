// File: src/components/portfolio/PortfolioContainer.tsx
// Main container component for portfolio page

"use client"

import { useState, useEffect } from "react"
// import PortfolioHeader from "./PortfolioHeader"
import PortfolioFilter from "./PortfolioFilter"
import PortfolioGrid from "./PortfolioGrid"
import PortfolioPagination from "./PortfolioPagination"

interface Portfolio {
  id: string
  title: string
  description: string
  gallery: string
  coverImage: string
  loves: number
  createdAt: string
}

export default function PortfolioContainer() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([])
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // 4 images per row, 2 rows = 8 images per page

  // Fetch portfolios from API
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/portfolios')
        if (response.ok) {
          const data = await response.json()
          setPortfolios(data)
          setFilteredPortfolios(data)
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  // Filter portfolios based on selected gallery
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredPortfolios(portfolios)
    } else {
      setFilteredPortfolios(portfolios.filter(p => p.gallery === selectedFilter))
    }
    setCurrentPage(1) // Reset to first page when filter changes
  }, [selectedFilter, portfolios])

  // Handle love button click
  const handleLoveClick = async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/love`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const updatedPortfolio = await response.json()
        
        // Update portfolios state
        setPortfolios(portfolios.map(p => 
          p.id === portfolioId 
            ? { ...p, loves: updatedPortfolio.loves }
            : p
        ))
      }
    } catch (error) {
      console.error('Error updating love:', error)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredPortfolios.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPortfolios = filteredPortfolios.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="">
        
        {/* <PortfolioHeader /> */}
        
        <PortfolioFilter 
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          resultCount={filteredPortfolios.length}
        />
        
        <PortfolioGrid 
          portfolios={currentPortfolios}
          onLoveClick={handleLoveClick}
        />
        
        {totalPages > 1 && (
          <PortfolioPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      </div>
    </div>
  )
}