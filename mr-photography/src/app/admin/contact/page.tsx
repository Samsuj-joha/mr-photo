// File: /src/app/admin/contacts/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail,
  Phone,
  Calendar,
  Eye,
  MoreVertical,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  User,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X
} from "lucide-react"
import { format } from "date-fns"

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'PENDING' | 'REPLIED' | 'RESOLVED'
  createdAt: string
}

interface ContactsResponse {
  contacts: Contact[]
  stats: {
    total: number
    pending: number
    replied: number
    resolved: number
  }
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    replied: 0,
    resolved: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [filters, setFilters] = useState({
    status: "all",
    search: ""
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  })
  const [isExporting, setIsExporting] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: "10"
      })
      
      if (filters.status !== "all") params.append("status", filters.status)
      if (filters.search) params.append("search", filters.search)

      const response = await fetch(`/api/admin/contact?${params}`)
      const data: ContactsResponse = await response.json()
      
      if (response.ok) {
        setContacts(data.contacts)
        setStats(data.stats)
        setPagination(data.pagination)
      } else {
        console.error("Failed to fetch contacts")
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [pagination.currentPage, filters])

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact)
    setDialogOpen(true)
  }

  const handleUpdateStatus = async (contactId: string, status: Contact['status']) => {
    try {
      const response = await fetch(`/api/admin/contact/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        setContacts(prev => prev.map(c => 
          c.id === contactId ? { ...c, status } : c
        ))
        if (selectedContact?.id === contactId) {
          setSelectedContact(prev => prev ? { ...prev, status } : null)
        }
        fetchContacts() // Refresh to update stats
      }
    } catch (error) {
      console.error("Error updating contact status:", error)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return
    
    try {
      const response = await fetch(`/api/admin/contact/${contactId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setContacts(prev => prev.filter(c => c.id !== contactId))
        setDialogOpen(false)
        setSelectedContact(null)
        fetchContacts()
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  const handleBulkAction = async (action: string, status?: string) => {
    if (selectedContacts.length === 0) return
    
    setBulkLoading(true)
    try {
      const response = await fetch('/api/admin/contact/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ids: selectedContacts,
          data: status ? { status } : undefined
        })
      })
      
      if (response.ok) {
        setSelectedContacts([])
        fetchContacts()
      }
    } catch (error) {
      console.error("Error performing bulk action:", error)
    } finally {
      setBulkLoading(false)
    }
  }

  const handleExport = async (format: string = 'csv') => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams({ format })
      if (filters.status !== "all") params.append("status", filters.status)
      
      const response = await fetch(`/api/admin/contact/export?${params}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `contacts-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error exporting contacts:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const getStatusBadge = (status: Contact['status']) => {
    const variants = {
      PENDING: { variant: "destructive" as const, label: "Pending", icon: AlertCircle },
      REPLIED: { variant: "default" as const, label: "Replied", icon: Clock },
      RESOLVED: { variant: "default" as const, label: "Resolved", icon: CheckCircle }
    }
    
    const config = variants[status]
    const IconComponent = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(contacts.map(c => c.id))
    } else {
      setSelectedContacts([])
    }
  }

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId])
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId))
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and respond to customer inquiries
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchContacts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Messages
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.pending}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Replied
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.replied}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Resolved
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.resolved}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {filters.status === "all" ? "All" : filters.status}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, status: "all" }))}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, status: "PENDING" }))}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, status: "REPLIED" }))}>
                    Replied
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, status: "RESOLVED" }))}>
                    Resolved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bulk Actions */}
            {selectedContacts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedContacts.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" disabled={bulkLoading}>
                      {bulkLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction('updateStatus', 'REPLIED')}>
                      Mark as Replied
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('updateStatus', 'RESOLVED')}>
                      Mark as Resolved
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('delete')}
                      className="text-red-600"
                    >
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedContacts([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({pagination.totalCount})</CardTitle>
          <CardDescription>
            Click on any message to view details and respond
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No messages found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filters.search || filters.status !== "all" 
                  ? "Try adjusting your filters" 
                  : "No contact messages yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedContacts.length === contacts.length && contacts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow 
                      key={contact.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleViewContact(contact)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {contact.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{contact.subject}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                          {contact.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(contact.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(contact.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewContact(contact) }}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUpdateStatus(contact.id, 'REPLIED') }}>
                              <Clock className="h-4 w-4 mr-2" />
                              Mark as Replied
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUpdateStatus(contact.id, 'RESOLVED') }}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Resolved
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => { e.stopPropagation(); handleDeleteContact(contact.id) }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrev}
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNext}
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Contact Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedContact && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Contact Details</span>
                  {getStatusBadge(selectedContact.status)}
                </DialogTitle>
                <DialogDescription>
                  Received on {format(new Date(selectedContact.createdAt), 'MMMM dd, yyyy at HH:mm')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">Name:</span>
                      <span>{selectedContact.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">Email:</span>
                      <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Phone:</span>
                        <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Subject</h4>
                  <p className="text-gray-700 dark:text-gray-300">{selectedContact.subject}</p>
                </div>

                {/* Message */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Message</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'REPLIED')}
                    variant="outline"
                    size="sm"
                    disabled={selectedContact.status === 'REPLIED'}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mark as Replied
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'RESOLVED')}
                    variant="outline"
                    size="sm"
                    disabled={selectedContact.status === 'RESOLVED'}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900"
                  >
                    <a href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}