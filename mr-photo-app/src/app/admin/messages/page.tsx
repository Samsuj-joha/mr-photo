"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Mail,
  MailOpen,
  Reply,
  Trash2,
  Star,
  Clock,
  User,
  Phone,
  Calendar,
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from "lucide-react"

// Sample messages data
const sampleMessages = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    subject: "Wedding Photography Inquiry",
    message: "Hi! I'm interested in booking you for my wedding on June 15th, 2024. Could we discuss your packages and availability?",
    status: "PENDING",
    priority: "high",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
    eventType: "wedding",
    budget: "$3000-$5000",
    eventDate: "2024-06-15",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@techstart.com",
    phone: "+1 (555) 987-6543",
    subject: "Corporate Headshots",
    message: "We need professional headshots for our team of 15 people. Looking for studio session, when would be your earliest availability?",
    status: "REPLIED",
    priority: "medium",
    createdAt: "2024-01-19T14:15:00Z",  
    updatedAt: "2024-01-19T16:22:00Z",
    eventType: "corporate",
    budget: "$1500-$2000",
    eventDate: "2024-02-01",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@gmail.com",
    phone: "+1 (555) 456-7890",
    subject: "Family Portrait Session",
    message: "Hi there! I'd love to book a family portrait session for 6 people. Do you offer outdoor sessions? What are your rates?",
    status: "RESOLVED",
    priority: "low",
    createdAt: "2024-01-18T09:45:00Z",
    updatedAt: "2024-01-18T15:30:00Z",
    eventType: "portrait",
    budget: "$500-$800",
    eventDate: "2024-02-10",
  },
]

const statusOptions = [
  { value: "all", label: "All Messages" },
  { value: "PENDING", label: "Pending" },
  { value: "REPLIED", label: "Replied" },
  { value: "RESOLVED", label: "Resolved" },
]

const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
]

export default function AdminMessages() {
  const [messages, setMessages] = useState(sampleMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || message.status === filterStatus
    const matchesPriority = filterPriority === "all" || message.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "REPLIED": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "RESOLVED": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-600 dark:text-red-400"
      case "medium": return "text-yellow-600 dark:text-yellow-400"
      case "low": return "text-green-600 dark:text-green-400"
      default: return "text-gray-600 dark:text-gray-400"
    }
  }

  const handleStatusChange = (messageId, newStatus) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, status: newStatus, updatedAt: new Date().toISOString() } : m
    ))
  }

  const MessageDetailModal = ({ message, isOpen, onClose }) => {
    const [replyMessage, setReplyMessage] = useState("")

    if (!message) return null

    const handleReply = () => {
      console.log("Sending reply:", replyMessage)
      handleStatusChange(message.id, "REPLIED")
      setReplyMessage("")
      onClose()
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Message Details</span>
              <Badge className={getStatusColor(message.status)}>
                {message.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{message.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{message.email}</span>
                  </div>
                  {message.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{message.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Event Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span> 
                    <span className="ml-2 capitalize">{message.eventType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Budget:</span> 
                    <span className="ml-2">{message.budget}</span>
                  </div>
                  {message.eventDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{new Date(message.eventDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <h4 className="font-medium mb-2">Subject: {message.subject}</h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm leading-relaxed">{message.message}</p>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Received: {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}</span>
                <span className={`font-medium ${getPriorityColor(message.priority)}`}>
                  {message.priority.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={message.status === "PENDING" ? "default" : "outline"}
                onClick={() => handleStatusChange(message.id, "PENDING")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Pending
              </Button>
              <Button 
                size="sm" 
                variant={message.status === "REPLIED" ? "default" : "outline"}
                onClick={() => handleStatusChange(message.id, "REPLIED")}
              >
                <Reply className="h-4 w-4 mr-2" />
                Replied
              </Button>
              <Button 
                size="sm" 
                variant={message.status === "RESOLVED" ? "default" : "outline"}
                onClick={() => handleStatusChange(message.id, "RESOLVED")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolved
              </Button>
            </div>

            {/* Reply Form */}
            <div>
              <h4 className="font-medium mb-2">Send Reply</h4>
              <Textarea
                placeholder="Type your reply message here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
                className="mb-3"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={handleReply} disabled={!replyMessage.trim()}>
                  <Reply className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage contact inquiries and customer messages
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{messages.filter(m => m.status === "PENDING").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold">{messages.filter(m => m.status === "RESOLVED").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium">High Priority</p>
                <p className="text-2xl font-bold">{messages.filter(m => m.priority === "high").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {message.name}
                      </h3>
                      <Badge className={getPriorityColor(message.priority)} variant="outline">
                        {message.priority}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                  </div>
                  
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {message.subject}
                  </p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {message.message}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {message.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                    <div className="capitalize">
                      {message.eventType}
                    </div>
                    <div>
                      {message.budget}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedMessage(message)
                      setIsDetailModalOpen(true)
                    }}
                  >
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No messages found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || filterStatus !== "all" || filterPriority !== "all"
              ? "Try adjusting your search or filter criteria."
              : "You don't have any messages yet."
            }
          </p>
        </div>
      )}

      {/* Message Detail Modal */}
      <MessageDetailModal 
        message={selectedMessage}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedMessage(null)
        }}
      />
    </div>
  )
}