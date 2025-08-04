"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, ArrowRight, Star, Camera, Loader2 } from "lucide-react"

interface BookTag {
  id: string
  name: string
  color: string
}

interface Book {
  id: string
  title: string
  subtitle?: string
  author: string
  description: string
  volume: string
  pages: number
  rating: number
  category: string
  coverImage?: string
  pdfUrl?: string
  slug: string
  featured: boolean
  published: boolean
  publishedAt?: string
  tags: BookTag[]
}

const BookPage = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      const response = await fetch('/api/books')
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      } else {
        setError("Failed to load books")
      }
    } catch (error) {
      console.error('Failed to load books:', error)
      setError("Failed to load books")
    } finally {
      setIsLoading(false)
    }
  }

  const getTagColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700",
      yellow: "bg-yellow-100 text-yellow-700",
      pink: "bg-pink-100 text-pink-700",
      indigo: "bg-indigo-100 text-indigo-700",
      gray: "bg-gray-100 text-gray-700"
    }
    return colorMap[color] || "bg-gray-100 text-gray-700"
  }

  const getVolumeColorClass = (volume: string) => {
    if (volume.includes("1")) {
      return "bg-gradient-to-r from-blue-500 to-blue-600"
    } else if (volume.includes("2")) {
      return "bg-gradient-to-r from-purple-500 to-purple-600"
    } else if (volume.includes("3")) {
      return "bg-gradient-to-r from-green-500 to-green-600"
    }
    return "bg-gradient-to-r from-gray-500 to-gray-600"
  }

  // Helper function to get PDF viewer URL
  const getPdfViewerUrl = (pdfUrl: string) => {
    if (pdfUrl.startsWith('/uploads/pdfs/')) {
      // For local PDFs, use our PDF viewer route
      const filename = pdfUrl.split('/').pop()
      return `/api/pdf-viewer/${filename}`
    }
    // For Cloudinary PDFs, return the URL as is
    return pdfUrl
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    )
  }

  if (error || books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-4">No Books Available</h1>
          <p className="text-gray-600">{error || "No books have been published yet."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
          Life Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">The Lens</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
          An extraordinary visual odyssey through the masterful photography of 
          <span className="text-blue-600 font-semibold"> Moshiur Rahman</span>
        </p>
      </div>

      {/* Books Showcase Section */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {books.map((book) => (
            <div key={book.id} className="group relative">
              {book.pdfUrl ? (
                <a href={getPdfViewerUrl(book.pdfUrl)} target="_blank" rel="noopener noreferrer">
                  <div className="relative bg-white overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    
                    {/* Volume Badge */}
                    <div className="absolute top-6 right-6 z-20">
                      <div className={`${getVolumeColorClass(book.volume)} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                        {book.volume}
                      </div>
                    </div>

                    {/* Book Cover */}
                    <div className="relative h-[300px] w-full overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <div className="bg-gradient-to-t from-black/60 to-transparent p-6 -m-6">
                          <div className="flex items-center space-x-2 text-blue-300 mb-2">
                            <Camera size={16} />
                            <span className="text-sm font-medium">{book.category}</span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                            {book.title.toUpperCase()}
                          </h3>
                          <p className="text-gray-200">by {book.author}</p>
                        </div>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="p-6 h-[200px] flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-blue-600">
                            <BookOpen size={18} className="mr-2" />
                            <span className="font-semibold">{book.pages} pages</span>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <Star size={16} className="mr-1 fill-current" />
                            <span className="font-semibold">{book.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-700 font-semibold group-hover:text-blue-600 transition-colors">
                          <span>Read Now</span>
                          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      <p className="text-gray-600 leading-snug mb-4 flex-grow text-sm">
                        {book.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {book.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColorClass(tag.color)}`}>
                            {tag.name}
                          </span>
                        ))}
                        {book.tags.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            +{book.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="relative bg-white overflow-hidden shadow-xl border border-gray-100 opacity-75">
                  
                  {/* Volume Badge */}
                  <div className="absolute top-6 right-6 z-20">
                    <div className={`${getVolumeColorClass(book.volume)} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-75`}>
                      {book.volume}
                    </div>
                  </div>

                  {/* Book Cover */}
                  <div className="relative h-[300px] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                    {book.coverImage ? (
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <div className="bg-black/80 text-white px-6 py-3 rounded-lg">
                        <span className="font-semibold">Coming Soon</span>
                      </div>
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <div className="bg-gradient-to-t from-black/60 to-transparent p-6 -m-6">
                        <div className="flex items-center space-x-2 text-blue-300 mb-2">
                          <Camera size={16} />
                          <span className="text-sm font-medium">{book.category}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                          {book.title.toUpperCase()}
                        </h3>
                        <p className="text-gray-200">by {book.author}</p>
                      </div>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-6 h-[200px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-blue-600">
                          <BookOpen size={18} className="mr-2" />
                          <span className="font-semibold">{book.pages} pages</span>
                        </div>
                        <div className="flex items-center text-yellow-500">
                          <Star size={16} className="mr-1 fill-current" />
                          <span className="font-semibold">{book.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 font-semibold">
                        <span>Coming Soon</span>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-snug mb-4 flex-grow text-sm">
                      {book.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {book.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColorClass(tag.color)}`}>
                          {tag.name}
                        </span>
                      ))}
                      {book.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          +{book.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookPage