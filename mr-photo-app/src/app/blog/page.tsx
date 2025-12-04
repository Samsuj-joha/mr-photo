// File: /src/app/blog/page.tsx
// Dynamic blog page that fetches real data from your API

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  published: boolean
  featured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  // Filter posts - only show published posts
  const filteredPosts = posts.filter(post => post.published)

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  // Fetch posts from your API
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        console.log('🔄 Fetching blog posts...')
        
        // Fetch all published blog posts from public API
        const response = await fetch('/api/blog', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const publishedPosts = data.blogs || [] // Handle the new API structure
        console.log(`✅ Fetched ${publishedPosts.length} blog posts`)
        
        setPosts(publishedPosts)
        
      } catch (error) {
        console.error('❌ Error fetching posts:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch blog posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  const retryFetch = () => {
    window.location.reload()
  }

  // Loading skeleton component
  const PostSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <div className="flex items-center space-x-4 mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load blog posts
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <Button onClick={retryFetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-16">
            {/* Featured Posts Skeleton */}
            <section>
              <div className="flex items-center mb-8">
                <Skeleton className="h-6 w-6 mr-2" />
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PostSkeleton />
                <PostSkeleton />
              </div>
            </section>

            {/* Regular Posts Skeleton */}
            <section>
              <div className="flex items-center mb-8">
                <Skeleton className="h-6 w-6 mr-2" />
                <Skeleton className="h-8 w-40" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </div>
            </section>
          </div>
        )}

        {/* Blog Posts */}
        {!isLoading && !error && (
          <>
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center mb-8">
                  <TrendingUp className="h-6 w-6 text-gray-900 dark:text-white mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Featured Articles</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative h-64 overflow-hidden">
                          {post.coverImage && !failedImages.has(post.id) ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized={post.coverImage.includes('cloudinary.com')}
                              onError={() => {
                                // Silently handle error and show fallback
                                setFailedImages(prev => new Set(prev).add(post.id))
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                              <BookOpen className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                          <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                            Featured
                          </Badge>
                        </div>
                        
                        <CardHeader>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{getReadingTime(post.content)}</span>
                            </div>
                          </div>
                          <CardTitle className="group-hover:text-gray-600 transition-colors">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3">
                            {post.excerpt || post.content.substring(0, 150) + "..."}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="flex items-center justify-end">
                            <Button variant="ghost" size="sm" className="group">
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <section>
                <div className="flex items-center mb-8">
                  <BookOpen className="h-6 w-6 text-gray-900 dark:text-white mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles'}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                          {post.coverImage && !failedImages.has(post.id) ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized={post.coverImage.includes('cloudinary.com')}
                              onError={() => {
                                // Silently handle error and show fallback
                                setFailedImages(prev => new Set(prev).add(post.id))
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <CardHeader>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{getReadingTime(post.content)}</span>
                            </div>
                          </div>
                          <CardTitle className="group-hover:text-gray-600 transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3">
                            {post.excerpt || post.content.substring(0, 120) + "..."}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="flex items-center justify-end">
                            <Button variant="ghost" size="sm" className="group">
                              Read
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredPosts.length === 0 && posts.length > 0 && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
              </div>
            )}

            {/* No Posts at All */}
            {posts.length === 0 && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No blog posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Check back soon for amazing photography insights and tips!
                </p>
              </div>
            )}
          </>
        )}

        {/* Load More Button (for pagination - can implement later) */}
        {!isLoading && !error && filteredPosts.length > 0 && posts.length >= 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" disabled>
              <span className="text-gray-500">Pagination coming soon...</span>
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}