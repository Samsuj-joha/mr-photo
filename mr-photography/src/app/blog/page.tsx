// File: /src/app/blog/page.tsx

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Tag,
  TrendingUp
} from "lucide-react"

// Sample data - Replace with API call later
const samplePosts = [
  {
    id: 1,
    title: "10 Tips for Perfect Wedding Photography",
    slug: "wedding-photography-tips",
    excerpt: "Discover the secrets to capturing unforgettable wedding moments that will last a lifetime. From preparation to execution, learn the techniques that make all the difference.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop",
    published: true,
    featured: true,
    tags: ["wedding", "photography", "tips"],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: 2,
    title: "The Art of Portrait Lighting",
    slug: "portrait-lighting-guide",
    excerpt: "Master the fundamentals of portrait lighting techniques. Learn how different lighting setups can dramatically change the mood and impact of your portraits.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&h=500&fit=crop",
    published: true,
    featured: false,
    tags: ["portrait", "lighting", "techniques"],
    createdAt: "2024-03-10T14:30:00Z",
    updatedAt: "2024-03-10T14:30:00Z",
  },
  {
    id: 3,
    title: "Corporate Event Photography: Best Practices",
    slug: "corporate-event-photography",
    excerpt: "Learn the essential skills and techniques for successful corporate event photography. From networking events to conferences, capture professional moments that matter.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop",
    published: true,
    featured: true,
    tags: ["corporate", "events", "business"],
    createdAt: "2024-03-05T09:15:00Z",
    updatedAt: "2024-03-05T09:15:00Z",
  },
  {
    id: 4,
    title: "Nature Photography: Capturing the Perfect Moment",
    slug: "nature-photography-guide",
    excerpt: "Explore the world of nature photography and learn how to capture stunning landscapes, wildlife, and natural phenomena with expert techniques and patience.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
    published: true,
    featured: false,
    tags: ["nature", "landscape", "wildlife"],
    createdAt: "2024-03-01T16:45:00Z",
    updatedAt: "2024-03-01T16:45:00Z",
  },
  {
    id: 5,
    title: "Post-Processing Workflow for Professional Results",
    slug: "post-processing-workflow",
    excerpt: "Streamline your photo editing process with a professional workflow that ensures consistent, high-quality results every time.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=500&fit=crop",
    published: true,
    featured: false,
    tags: ["editing", "workflow", "post-processing"],
    createdAt: "2024-02-25T11:20:00Z",
    updatedAt: "2024-02-25T11:20:00Z",
  },
  {
    id: 6,
    title: "Building Your Photography Portfolio",
    slug: "building-photography-portfolio",
    excerpt: "Essential tips for creating a compelling photography portfolio that showcases your best work and attracts your ideal clients.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop",
    published: true,
    featured: true,
    tags: ["portfolio", "business", "career"],
    createdAt: "2024-02-20T13:10:00Z",
    updatedAt: "2024-02-20T13:10:00Z",
  },
]

const popularTags = [
  "wedding", "portrait", "nature", "corporate", "tips", 
  "lighting", "editing", "business", "techniques", "gear"
]

export default function BlogPage() {
  const [posts, setPosts] = useState(samplePosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Filter posts based on search and tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag && post.published
  })

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  // Fetch posts from API (replace sample data later)
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        // const response = await fetch('/api/blog?published=true')
        // const data = await response.json()
        // setPosts(data)
        
        // For now, use sample data
        setTimeout(() => {
          setPosts(samplePosts)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching posts:', error)
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

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6">
            Photography Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tips, and stories from behind the lens. Discover the art and craft of professional photography.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search articles, topics, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 text-base"
                />
              </div>
            </div>

            {/* Popular Tags */}
            <div className="w-full lg:w-auto">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={!selectedTag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag("")}
                >
                  All Posts
                </Badge>
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            {selectedTag && (
              <span className="ml-2">
                tagged with <Badge variant="secondary" className="capitalize">{selectedTag}</Badge>
              </span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}

        {/* Blog Posts */}
        {!isLoading && (
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
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
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
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs capitalize">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button asChild variant="ghost" size="sm" className="group">
                            <Link href={`/blog/${post.slug}`}>
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
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
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Latest Articles</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
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
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs capitalize">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button asChild variant="ghost" size="sm" className="group">
                            <Link href={`/blog/${post.slug}`}>
                              Read
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredPosts.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or explore different tags.
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setSelectedTag("")
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Load More Button (for pagination later) */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}