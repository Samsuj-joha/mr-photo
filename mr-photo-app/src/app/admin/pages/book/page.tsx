"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus,
  Edit,
  Trash2,
  Upload,
  FileText,
  Image as ImageIcon,
  Save,
  X,
  Star,
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react"
import Image from "next/image"

interface BookTag {
  id?: string
  name: string
  color: string
}

interface Book {
  id?: string
  title: string
  subtitle?: string
  author: string
  description: string
  volume: string
  pages: number
  rating: number
  category: string
  coverImage?: string
  coverImagePublicId?: string
  pdfUrl?: string
  pdfPublicId?: string
  slug?: string
  featured: boolean
  published: boolean
  order: number
  publishedAt?: string
  tags: BookTag[]
}

const defaultBook: Book = {
  title: "",
  subtitle: "",
  author: "Moshiur Rahman",
  description: "",
  volume: "",
  pages: 0,
  rating: 5.0,
  category: "",
  featured: false,
  published: true,
  order: 0,
  tags: []
}

const tagColors = [
  "blue", "purple", "green", "red", "yellow", "pink", "indigo", "gray"
]

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState("")
  const [newTag, setNewTag] = useState("")
  const [selectedTagColor, setSelectedTagColor] = useState("blue")

  const coverInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/books')
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

  const handleSave = async () => {
    if (!selectedBook) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const url = selectedBook.id ? `/api/admin/books/${selectedBook.id}` : '/api/admin/books'
      const method = selectedBook.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBook),
      })

      if (response.ok) {
        const savedBook = await response.json()
        
        if (selectedBook.id) {
          setBooks(prev => prev.map(book => book.id === savedBook.id ? savedBook : book))
        } else {
          setBooks(prev => [...prev, savedBook])
        }
        
        setSelectedBook(savedBook)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save book")
      }
    } catch (error) {
      setError("An error occurred while saving")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBooks(prev => prev.filter(book => book.id !== bookId))
        if (selectedBook?.id === bookId) {
          setSelectedBook(null)
          setIsEditing(false)
        }
      } else {
        setError("Failed to delete book")
      }
    } catch (error) {
      setError("Failed to delete book")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf') => {
    const file = event.target.files?.[0]
    if (!file || !selectedBook) return

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/admin/books/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        
        console.log('Upload result:', result)
        
        // Delete old file if exists
        if (type === 'cover' && selectedBook.coverImagePublicId) {
          await deleteFile(selectedBook.coverImagePublicId)
        } else if (type === 'pdf' && selectedBook.pdfPublicId) {
          await deleteFile(selectedBook.pdfPublicId)
        }

        setSelectedBook(prev => prev ? {
          ...prev,
          [type === 'cover' ? 'coverImage' : 'pdfUrl']: result.url,
          [type === 'cover' ? 'coverImagePublicId' : 'pdfPublicId']: result.publicId
        } : null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to upload file")
      }
    } catch (error) {
      setError("Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const deleteFile = async (publicId: string) => {
    try {
      await fetch('/api/admin/books/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      })
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const addTag = () => {
    if (!newTag.trim() || !selectedBook) return

    const tag: BookTag = {
      name: newTag.trim(),
      color: selectedTagColor
    }

    setSelectedBook(prev => prev ? {
      ...prev,
      tags: [...prev.tags, tag]
    } : null)

    setNewTag("")
  }

  const removeTag = (index: number) => {
    if (!selectedBook) return

    setSelectedBook(prev => prev ? {
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    } : null)
  }

  const startEditing = (book?: Book) => {
    setSelectedBook(book ? { ...book } : { ...defaultBook })
    setIsEditing(true)
    setError("")
    setIsSaved(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setSelectedBook(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white tracking-wide">
            Books Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your photography books and publications
          </p>
        </div>
        <Button 
          onClick={() => startEditing()}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800 dark:text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {isSaved && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800 dark:text-green-400">
            Book saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Books List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>All Books ({books.length})</CardTitle>
              <CardDescription>
                Manage your photography books
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && books.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedBook?.id === book.id 
                          ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{book.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{book.volume}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={book.published ? "default" : "secondary"} className="text-xs">
                              {book.published ? "Published" : "Draft"}
                            </Badge>
                            {book.featured && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(book)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              book.id && handleDelete(book.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Book Editor */}
        <div className="lg:col-span-2">
          {isEditing && selectedBook ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedBook.id ? 'Edit Book' : 'Create New Book'}
                    </CardTitle>
                    <CardDescription>
                      Fill in the book details and upload files
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={cancelEditing}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Book
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={selectedBook.title}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, title: e.target.value} : null)}
                      placeholder="Book title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume *</Label>
                    <Input
                      id="volume"
                      value={selectedBook.volume}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, volume: e.target.value} : null)}
                      placeholder="e.g., Volume 1.0"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={selectedBook.author}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, author: e.target.value} : null)}
                      placeholder="Author name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={selectedBook.category}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, category: e.target.value} : null)}
                      placeholder="e.g., Documentary Series"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={selectedBook.subtitle || ""}
                    onChange={(e) => setSelectedBook(prev => prev ? {...prev, subtitle: e.target.value} : null)}
                    placeholder="Book subtitle (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={selectedBook.description}
                    onChange={(e) => setSelectedBook(prev => prev ? {...prev, description: e.target.value} : null)}
                    placeholder="Book description..."
                    rows={4}
                  />
                </div>

                {/* Book Details */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="pages">Pages</Label>
                    <Input
                      id="pages"
                      type="number"
                      value={selectedBook.pages}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, pages: parseInt(e.target.value) || 0} : null)}
                      placeholder="Number of pages"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (out of 5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={selectedBook.rating}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, rating: parseFloat(e.target.value) || 0} : null)}
                      placeholder="4.9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt">Published Date</Label>
                    <Input
                      id="publishedAt"
                      type="date"
                      value={selectedBook.publishedAt ? new Date(selectedBook.publishedAt).toISOString().split('T')[0] : ''}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, publishedAt: e.target.value} : null)}
                    />
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Cover Image */}
                  <div className="space-y-4">
                    <Label>Cover Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {selectedBook.coverImage ? (
                        <div className="relative">
                          <Image
                            src={selectedBook.coverImage}
                            alt="Cover"
                            width={200}
                            height={250}
                            className="rounded-lg object-cover mx-auto"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setSelectedBook(prev => prev ? {...prev, coverImage: undefined, coverImagePublicId: undefined} : null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">No cover image</p>
                        </div>
                      )}
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'cover')}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Cover
                      </Button>
                    </div>
                  </div>

                  {/* PDF File */}
                  <div className="space-y-4">
                    <Label>PDF File</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {selectedBook.pdfUrl ? (
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto text-green-600 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">PDF uploaded</p>
                          <a
                            href={selectedBook.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:underline text-sm"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View PDF
                          </a>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">No PDF file</p>
                        </div>
                      )}
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'pdf')}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => pdfInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload PDF
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedBook.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-${tag.color}-500`}></span>
                        {tag.name}
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <select
                      value={selectedTagColor}
                      onChange={(e) => setSelectedTagColor(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      {tagColors.map(color => (
                        <option key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </option>
                      ))}
                    </select>
                    <Button onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Settings */}
                <div className="flex items-center gap-6 pt-4 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBook.featured}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, featured: e.target.checked} : null)}
                      className="rounded"
                    />
                    <Star className="h-4 w-4" />
                    <span>Featured Book</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBook.published}
                      onChange={(e) => setSelectedBook(prev => prev ? {...prev, published: e.target.checked} : null)}
                      className="rounded"
                    />
                    {selectedBook.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <span>Published</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          ) : selectedBook ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedBook.title}</CardTitle>
                    <CardDescription>{selectedBook.volume}</CardDescription>
                  </div>
                  <Button onClick={() => startEditing(selectedBook)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Book
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    {selectedBook.coverImage && (
                      <Image
                        src={selectedBook.coverImage}
                        alt={selectedBook.title}
                        width={300}
                        height={375}
                        className="rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-700">{selectedBook.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{selectedBook.pages} pages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span>{selectedBook.rating}</span>
                      </div>
                    </div>
                    {selectedBook.pdfUrl && (
                      <a
                        href={selectedBook.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View PDF
                      </a>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {selectedBook.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Book Selected</h3>
                  <p className="text-gray-600">Select a book from the list or create a new one</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}