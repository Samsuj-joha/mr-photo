// File: src/app/blog/[slug]/page.tsx
// Individual blog post detail page

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Tag,
  User,
  Mail,
  Globe,
  MessageSquare,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Copy,
  Check,
  Heart,
  BookOpen,
  Eye
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

interface CommentForm {
  name: string
  email: string
  website: string
  message: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentSubmitted, setCommentSubmitted] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Comment form state
  const [commentForm, setCommentForm] = useState<CommentForm>({
    name: "",
    email: "",
    website: "",
    message: ""
  })

  // Fetch individual blog post
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        console.log(`🔍 Fetching blog post: ${slug}`)
        
        // First try to get from all blogs and find by slug
        const response = await fetch('/api/admin/blogs')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`)
        }
        
        const allPosts: BlogPost[] = await response.json()
        const foundPost = allPosts.find(p => p.slug === slug && p.published)
        
        if (!foundPost) {
          throw new Error('Blog post not found or not published')
        }
        
        setPost(foundPost)
        console.log('✅ Blog post loaded:', foundPost.title)
        
      } catch (error) {
        console.error('❌ Error fetching post:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch blog post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  // Handle comment form submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentForm.name || !commentForm.email || !commentForm.message) {
      alert('Please fill in all required fields (Name, Email, Message)')
      return
    }
    
    setIsSubmittingComment(true)
    
    try {
      // Submit comment to API
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post?.id,
          postTitle: post?.title,
          ...commentForm
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit comment')
      }

      const result = await response.json()
      console.log('✅ Comment submitted:', result)
      
      // Reset form and show success
      setCommentForm({ name: "", email: "", website: "", message: "" })
      setCommentSubmitted(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setCommentSubmitted(false), 3000)
      
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment. Please try again.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // Social sharing functions
  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post?.title || '')
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank')
  }

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post?.title || '')
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
  }

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post?.title || '')
    const summary = encodeURIComponent(post?.excerpt || '')
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // No post found
  if (!post) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Post not found
          </h1>
          <Link href="/blog">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Back to Blog Link */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <article className="space-y-8">
          
          {/* Cover Image */}
          {post.coverImage && !imageError ? (
            <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                unoptimized={post.coverImage.includes('cloudinary.com')}
                onError={() => {
                  // Silently handle error and show fallback
                  setImageError(true)
                }}
              />
              {post.featured && (
                <Badge className="absolute top-6 left-6 bg-yellow-500 text-white">
                  Featured
                </Badge>
              )}
            </div>
          ) : post.coverImage && imageError ? (
            <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Cover image unavailable</p>
              </div>
              {post.featured && (
                <Badge className="absolute top-6 left-6 bg-yellow-500 text-white">
                  Featured
                </Badge>
              )}
            </div>
          ) : null}

          {/* Article Header */}
          <div className="space-y-6">
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{getReadingTime(post.content)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>Photography</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-500" />
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

          </div>

          {/* Share Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Share this article</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareToFacebook}
                  className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                
                {/* Twitter */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareToTwitter}
                  className="hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                
                {/* LinkedIn */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareToLinkedIn}
                  className="hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                
                {/* Copy Link */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="hover:bg-gray-50 hover:border-gray-300"
                >
                  {urlCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <Separator className="my-12" />

          {/* Comments Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Leave a Comment
              </h2>
            </div>

            {/* Success Message */}
            {commentSubmitted && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                <CardContent className="flex items-center p-6">
                  <Check className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <div className="font-semibold text-green-800 dark:text-green-200">
                      Comment submitted successfully!
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Thank you for your comment. It's being reviewed and will appear soon.
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Share Your Thoughts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommentSubmit} className="space-y-6">
                  
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        required
                        disabled={isSubmittingComment}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        required
                        disabled={isSubmittingComment}
                      />
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website URL (Optional)
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={commentForm.website}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      disabled={isSubmittingComment}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Your Comment *
                    </Label>
                    <Textarea
                      id="message"
                      value={commentForm.message}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Share your thoughts about this article..."
                      rows={5}
                      required
                      disabled={isSubmittingComment}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={isSubmittingComment}
                  >
                    {isSubmittingComment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Comment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </article>

        {/* Related Posts Section (Optional - can be added later) */}
        <div className="mt-16">
          <Separator className="mb-8" />
          <div className="text-center">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Read More Articles
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}