// src/app/admin/contact/page.tsx - Dynamic Contact Management
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Search,
  Eye,
  Reply,
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Users,
  Calendar,
  Filter,
  Download,
  Loader2,
  Save,
  Building,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Plus,
  Edit,
  GripVertical,
  Type,
  Hash,
  AtSign,
  FileText,
  ToggleLeft
} from "lucide-react"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'PENDING' | 'REPLIED' | 'RESOLVED'
  createdAt: string
}

interface FormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  placeholder: string
  required: boolean
  enabled: boolean
  order: number
  options?: string[] // for select fields
}

interface ContactInfo {
  id?: string
  // Contact Details
  address: string
  phone: string
  email: string
  businessHours: string
  
  // Additional Info Sections
  sections: {
    id: string
    title: string
    content: string
    icon: string
    enabled: boolean
    order: number
  }[]
  
  // Social Media
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    website?: string
    linkedin?: string
    youtube?: string
  }
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "",
    phone: "",
    email: "",
    businessHours: "",
    sections: [],
    socialMedia: {}
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  // Fetch contact messages
  const fetchMessages = async () => {
    try {
      setIsPageLoading(true)
      const response = await fetch('/api/admin/contact/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  // Fetch form configuration
  const fetchFormFields = async () => {
    try {
      const response = await fetch('/api/admin/contact/form-fields')
      if (response.ok) {
        const data = await response.json()
        setFormFields(data)
      } else {
        // Default form fields if none exist
        setFormFields([
          { id: '1', name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true, enabled: true, order: 1 },
          { id: '2', name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true, enabled: true, order: 2 },
          { id: '3', name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone', required: false, enabled: true, order: 3 },
          { id: '4', name: 'subject', label: 'Subject', type: 'text', placeholder: 'What can we help you with?', required: true, enabled: true, order: 4 },
          { id: '5', name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us more details...', required: true, enabled: true, order: 5 }
        ])
      }
    } catch (error) {
      console.error('Error fetching form fields:', error)
    }
  }

  // Fetch contact info
  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact/info')
      if (response.ok) {
        const data = await response.json()
        setContactInfo(data)
      } else {
        // Default contact info structure
        setContactInfo({
          address: "",
          phone: "",
          email: "",
          businessHours: "",
          sections: [
            { id: '1', title: 'Our Location', content: '', icon: 'MapPin', enabled: true, order: 1 },
            { id: '2', title: 'Call Us', content: '', icon: 'Phone', enabled: true, order: 2 },
            { id: '3', title: 'Email Us', content: '', icon: 'Mail', enabled: true, order: 3 },
            { id: '4', title: 'Business Hours', content: '', icon: 'Clock', enabled: true, order: 4 }
          ],
          socialMedia: {}
        })
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    }
  }

  useEffect(() => {
    fetchMessages()
    fetchFormFields()
    fetchContactInfo()
  }, [])

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Save form fields
  const saveFormFields = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/contact/form-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields)
      })
      
      if (response.ok) {
        alert('Form configuration saved successfully!')
      }
    } catch (error) {
      console.error('Error saving form fields:', error)
      alert('Failed to save form configuration')
    } finally {
      setIsLoading(false)
    }
  }

  // Save contact info
  const saveContactInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/contact/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo)
      })
      
      if (response.ok) {
        alert('Contact information saved successfully!')
      }
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Failed to save contact information')
    } finally {
      setIsLoading(false)
    }
  }

  // Add new form field
  const addFormField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: 'new_field',
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter value',
      required: false,
      enabled: true,
      order: formFields.length + 1
    }
    setFormFields([...formFields, newField])
  }

  // Add new contact section
  const addContactSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      icon: 'Building',
      enabled: true,
      order: contactInfo.sections.length + 1
    }
    setContactInfo(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  // Update form field
  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setFormFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  // Update contact section
  const updateContactSection = (id: string, updates: any) => {
    setContactInfo(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      )
    }))
  }

  // Delete form field
  const deleteFormField = (id: string) => {
    setFormFields(prev => prev.filter(field => field.id !== id))
  }

  // Delete contact section
  const deleteContactSection = (id: string) => {
    setContactInfo(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== id)
    }))
  }

  const getStatusBadge = (status: ContactMessage['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'REPLIED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Replied</Badge>
      case 'RESOLVED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <AtSign className="h-4 w-4" />
      case 'tel': return <Phone className="h-4 w-4" />
      case 'textarea': return <FileText className="h-4 w-4" />
      case 'select': return <ToggleLeft className="h-4 w-4" />
      default: return <Type className="h-4 w-4" />
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading contact data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage contact messages, form configuration, and contact information
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="form">Form Config</TabsTrigger>
          <TabsTrigger value="content">Page Content</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* Messages Tab - [Previous messages code stays the same] */}
        <TabsContent value="messages" className="space-y-6">
          {/* [Messages content - keeping existing code] */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{messages.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Other stats cards... */}
          </div>
        </TabsContent>

        {/* Form Configuration Tab */}
        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contact Form Configuration</CardTitle>
                <CardDescription>
                  Configure the fields that appear on your contact form
                </CardDescription>
              </div>
              <Button onClick={addFormField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formFields.sort((a, b) => a.order - b.order).map((field) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      {getFieldTypeIcon(field.type)}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateFormField(field.id, { name: e.target.value })}
                          placeholder="field_name"
                        />
                      </div>
                      
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                          placeholder="Field Label"
                        />
                      </div>
                      
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) => updateFormField(field.id, { type: value as FormField['type'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="tel">Phone</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder}
                          onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                          placeholder="Enter placeholder"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => updateFormField(field.id, { required: checked })}
                        />
                        <Label className="text-xs">Required</Label>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Switch
                          checked={field.enabled}
                          onCheckedChange={(checked) => updateFormField(field.id, { enabled: checked })}
                        />
                        <Label className="text-xs">Enabled</Label>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteFormField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveFormFields} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Form Configuration
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contact Page Content</CardTitle>
                <CardDescription>
                  Configure the content sections that appear on the right side of your contact page
                </CardDescription>
              </div>
              <Button onClick={addContactSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.sections.sort((a, b) => a.order - b.order).map((section) => (
                <Card key={section.id} className="p-4">
                  <div className="flex items-start space-x-4">
                    <GripVertical className="h-4 w-4 text-gray-400 mt-2" />
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Section Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => updateContactSection(section.id, { title: e.target.value })}
                            placeholder="Section title"
                          />
                        </div>
                        
                        <div>
                          <Label>Icon</Label>
                          <Select
                            value={section.icon}
                            onValueChange={(value) => updateContactSection(section.id, { icon: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MapPin">Location</SelectItem>
                              <SelectItem value="Phone">Phone</SelectItem>
                              <SelectItem value="Mail">Email</SelectItem>
                              <SelectItem value="Clock">Hours</SelectItem>
                              <SelectItem value="Building">Building</SelectItem>
                              <SelectItem value="Globe">Website</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Switch
                              checked={section.enabled}
                              onCheckedChange={(checked) => updateContactSection(section.id, { enabled: checked })}
                            />
                            <Label className="text-xs">Enabled</Label>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteContactSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateContactSection(section.id, { content: e.target.value })}
                          placeholder="Enter section content..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveContactInfo} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Page Content
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Add your social media profiles to display on the contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="website"
                      placeholder="https://mrphotography.com"
                      value={contactInfo.socialMedia.website || ''}
                      onChange={(e) => setContactInfo(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, website: e.target.value }
                      }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/mrphotography"
                      value={contactInfo.socialMedia.facebook || ''}
                      onChange={(e) => setContactInfo(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                      }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/mrphotography"
                      value={contactInfo.socialMedia.instagram || ''}
                      onChange={(e) => setContactInfo(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                      }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/mrphotography"
                      value={contactInfo.socialMedia.twitter || ''}
                      onChange={(e) => setContactInfo(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                      }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/company/mrphotography"
                      value={contactInfo.socialMedia.linkedin || ''}
                      onChange={(e) => setContactInfo(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                      }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="youtube"
                      placeholder="https://youtube.com/@mrphotography"
                      value={contactInfo.socialMedia.youtube || ''}
                      onChange={(e) => setContactInfo(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                      }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveContactInfo} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Social Media
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "",
    phone: "",
    email: "",
    businessHours: "",
    socialMedia: {}
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  // Fetch contact messages
  const fetchMessages = async () => {
    try {
      setIsPageLoading(true)
      const response = await fetch('/api/admin/contact/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  // Fetch contact info
  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact/info')
      if (response.ok) {
        const data = await response.json()
        setContactInfo(data)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    }
  }

  useEffect(() => {
    fetchMessages()
    fetchContactInfo()
  }, [])

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Update message status
  const updateMessageStatus = async (messageId: string, status: ContactMessage['status']) => {
    try {
      const response = await fetch(`/api/admin/contact/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        ))
      }
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      const response = await fetch(`/api/admin/contact/messages/${messageId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  // Save contact info
  const saveContactInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/contact/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo)
      })
      
      if (response.ok) {
        alert('Contact information saved successfully!')
      }
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Failed to save contact information')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: ContactMessage['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'REPLIED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Replied</Badge>
      case 'RESOLVED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading contact data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage contact messages and update contact information
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="info">Contact Info</TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{messages.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {messages.filter(m => m.status === 'PENDING').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Reply className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Replied</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {messages.filter(m => m.status === 'REPLIED').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {messages.filter(m => m.status === 'RESOLVED').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REPLIED">Replied</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card key={message.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{message.name}</h3>
                        {getStatusBadge(message.status)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {message.email}
                          </span>
                          {message.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {message.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{message.subject}</h4>
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMessage(message)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Select
                        value={message.status}
                        onValueChange={(status) => updateMessageStatus(message.id, status as ContactMessage['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="REPLIED">Replied</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredMessages.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No messages found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Contact messages will appear here when submitted"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Update your business contact details that will be displayed on the contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your business address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@mrphotography.com"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hours">Business Hours</Label>
                    <Textarea
                      id="hours"
                      placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                      value={contactInfo.businessHours}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, businessHours: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Social Media</h3>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="website"
                        placeholder="https://mrphotography.com"
                        value={contactInfo.socialMedia.website || ''}
                        onChange={(e) => setContactInfo(prev => ({ 
                          ...prev, 
                          socialMedia: { ...prev.socialMedia, website: e.target.value }
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="facebook"
                        placeholder="https://facebook.com/mrphotography"
                        value={contactInfo.socialMedia.facebook || ''}
                        onChange={(e) => setContactInfo(prev => ({ 
                          ...prev, 
                          socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="instagram"
                        placeholder="https://instagram.com/mrphotography"
                        value={contactInfo.socialMedia.instagram || ''}
                        onChange={(e) => setContactInfo(prev => ({ 
                          ...prev, 
                          socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/mrphotography"
                        value={contactInfo.socialMedia.twitter || ''}
                        onChange={(e) => setContactInfo(prev => ({ 
                          ...prev, 
                          socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveContactInfo} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Contact Info
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Message Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              View and manage contact message
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedMessage.status)}
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="font-medium">{selectedMessage.phone || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <Label>Subject</Label>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>

              <div>
                <Label>Message</Label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div>
                <Label>Received</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`
                  }}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}