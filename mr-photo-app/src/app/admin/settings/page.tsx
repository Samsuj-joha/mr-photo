"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  User,
  Globe,
  Mail,
  Shield,
  Palette,
  Database,
  Bell,
  Save,
  Download,
  Eye,
  EyeOff,
  Camera,
  AlertTriangle,
  RefreshCw,
  Key,
  CheckCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [testingProvider, setTestingProvider] = useState<string | null>(null)

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState({
    siteName: "MR Photography",
    tagline: "Capturing Life's Perfect Moments",
    description: "Professional photography services for weddings, portraits, and events.",
    contactEmail: "hello@mrphotography.com",
    phone: "+1 (555) 123-4567",
    address: "123 Photography St, New York, NY 10001",
  })

  // Profile Settings State
  const [profileSettings, setProfileSettings] = useState({
    name: "Admin User",
    email: "admin@mrphotography.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  })

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "admin@mrphotography.com",
    smtpPassword: "",
    fromName: "MR Photography",
    fromEmail: "noreply@mrphotography.com",
    enableNotifications: true,
    enableNewsletter: true,
  })

  // SEO Settings State
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "MR Photography - Professional Photography Services",
    metaDescription: "Professional wedding, portrait, and event photography services. Capturing your precious moments with artistic vision and technical excellence.",
    keywords: "photography, wedding photographer, portrait photography, professional photographer",
    googleAnalytics: "GA_MEASUREMENT_ID",
    googleSearchConsole: "",
    facebookPixel: "",
  })

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    darkMode: false,
    maintenanceMode: false,
    logoPosition: "left",
    footerText: "© 2024 MR Photography. All rights reserved.",
  })

  // API Settings State
  const [apiSettings, setApiSettings] = useState({
    cloudinaryName: "mr-photography",
    cloudinaryKey: "123456789012345",
    cloudinarySecret: "abcdefghijklmnopqrstuvwxyz",
    enableApi: true,
    apiKey: "mrphoto_live_sk_123abc456def789ghi",
    webhookUrl: "https://mrphotography.com/webhook",
  })

  // Image Analysis API Settings State
  const [imageAnalysisSettings, setImageAnalysisSettings] = useState({
    activeProvider: "clarifai", // "google", "clarifai", "azure"
    googleApiKey: "",
    clarifaiApiKey: "",
    azureEndpoint: "",
    azureKey: "",
  })

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/image-analysis')
        if (response.ok) {
          const data = await response.json()
          setImageAnalysisSettings(prev => ({
            ...prev,
            activeProvider: data.activeProvider || "clarifai",
            // Don't load actual keys for security, just show if configured
            googleApiKey: data.googleApiKey === "***configured***" ? "" : data.googleApiKey || "",
            clarifaiApiKey: data.clarifaiApiKey === "***configured***" ? "" : data.clarifaiApiKey || "",
            azureEndpoint: data.azureEndpoint || "",
            azureKey: data.azureKey === "***configured***" ? "" : data.azureKey || "",
          }))
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
    
    const loadDatabaseSettings = async () => {
      setLoadingDatabaseSettings(true)
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setDatabaseSettings({
              categories: data.categories || [],
              settings: data.settings || {}
            })
          }
        }
      } catch (error) {
        console.error('Error loading database settings:', error)
      } finally {
        setLoadingDatabaseSettings(false)
      }
    }
    
    const loadAllCategories = async () => {
      setLoadingCategories(true)
      try {
        const response = await fetch('/api/admin/categories/all')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setAllCategories(data.categories || [])
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }
    
    loadSettings()
    loadDatabaseSettings()
    loadAllCategories()
  }, [])

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newBookings: true,
    newMessages: true,
    newReviews: true,
    systemUpdates: false,
    marketingEmails: false,
  })

  // Database Settings State
  const [databaseSettings, setDatabaseSettings] = useState<{
    categories: string[]
    settings: Record<string, Array<{ key: string; value: string | null; description: string | null }>>
  }>({
    categories: [],
    settings: {}
  })
  const [loadingDatabaseSettings, setLoadingDatabaseSettings] = useState(false)
  
  // All Categories State (from galleries, images, portfolios)
  const [allCategories, setAllCategories] = useState<Array<{ id: number; name: string }>>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Test API Key
  const testApiKey = async (provider: string) => {
    setTestingProvider(provider)
    try {
      let testResult = { success: false, message: "" }
      
      if (provider === "clarifai") {
        if (!imageAnalysisSettings.clarifaiApiKey) {
          toast.error("Please enter Clarifai API key first")
          return
        }
        // Test Clarifai API
        const response = await fetch("https://api.clarifai.com/v2/users/clarifai/apps/main/models", {
          headers: {
            "Authorization": `Key ${imageAnalysisSettings.clarifaiApiKey}`,
            "Content-Type": "application/json",
          },
        })
        if (response.ok) {
          testResult = { success: true, message: "Clarifai API is working!" }
          toast.success("Clarifai API is working!")
        } else {
          testResult = { success: false, message: "Invalid API key" }
          toast.error("Invalid Clarifai API key")
        }
      } else if (provider === "google") {
        if (!imageAnalysisSettings.googleApiKey) {
          toast.error("Please enter Google Vision API key first")
          return
        }
        // Test Google Vision API
        const response = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${imageAnalysisSettings.googleApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requests: [{
                image: { content: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" },
                features: [{ type: "LABEL_DETECTION", maxResults: 1 }],
              }],
            }),
          }
        )
        const data = await response.json()
        if (data.error) {
          testResult = { success: false, message: `Error: ${data.error.message}` }
          toast.error(`Google Vision API Error: ${data.error.message}`)
        } else {
          testResult = { success: true, message: "Google Vision API is working!" }
          toast.success("Google Vision API is working!")
        }
      } else if (provider === "azure") {
        if (!imageAnalysisSettings.azureEndpoint || !imageAnalysisSettings.azureKey) {
          toast.error("Please enter Azure endpoint and key first")
          return
        }
        // Test Azure Vision API
        const response = await fetch(`${imageAnalysisSettings.azureEndpoint}/vision/v3.2/models`, {
          headers: { "Ocp-Apim-Subscription-Key": imageAnalysisSettings.azureKey },
        })
        if (response.ok) {
          testResult = { success: true, message: "Azure AI Vision is working!" }
          toast.success("Azure AI Vision is working!")
        } else {
          testResult = { success: false, message: `Error: ${response.statusText}` }
          toast.error(`Azure Vision API Error: ${response.statusText}`)
        }
      }
    } catch (error: any) {
      toast.error(`Connection error: ${error.message}`)
    } finally {
      setTestingProvider(null)
    }
  }

  // Handle Save Function
  const handleSave = async (section: string) => {
    setIsLoading(true)
    try {
      if (section === 'api') {
        // Save image analysis API settings
        const response = await fetch('/api/admin/settings/image-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activeProvider: imageAnalysisSettings.activeProvider,
            googleApiKey: imageAnalysisSettings.googleApiKey,
            clarifaiApiKey: imageAnalysisSettings.clarifaiApiKey,
            azureEndpoint: imageAnalysisSettings.azureEndpoint,
            azureKey: imageAnalysisSettings.azureKey,
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          toast.success("Settings saved! Please add API keys to your .env file and restart the server.")
          console.log('Instructions:', data.instructions)
          
          // Refresh database settings to show newly saved settings
          const dbResponse = await fetch('/api/admin/settings')
          if (dbResponse.ok) {
            const dbData = await dbResponse.json()
            if (dbData.success) {
              setDatabaseSettings({
                categories: dbData.categories || [],
                settings: dbData.settings || {}
              })
            }
          }
        } else {
          toast.error('Failed to save image analysis settings')
        }
      }
      
      // Simulate API call for other settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (section !== 'api') {
        toast.success(`${section} settings saved successfully!`)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Backup Function
  const handleBackup = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const data = {
        siteSettings,
        profileSettings: { ...profileSettings, currentPassword: "", newPassword: "", confirmPassword: "" },
        emailSettings: { ...emailSettings, smtpPassword: "" },
        seoSettings,
        appearanceSettings,
        apiSettings: { ...apiSettings, cloudinarySecret: "", apiKey: "***hidden***" },
        notificationSettings,
        exportDate: new Date().toISOString(),
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mr-photography-settings-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error creating backup:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your website settings and preferences
          </p>
        </div>
        
        <Button variant="outline" onClick={handleBackup} disabled={isLoading}>
          <Download className="h-4 w-4 mr-2" />
          {isLoading ? "Exporting..." : "Export Settings"}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="database">Database Settings</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic website information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Site Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={siteSettings.tagline}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, tagline: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Site Description</Label>
                <Textarea
                  id="description"
                  value={siteSettings.description}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={siteSettings.phone}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('general')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your admin account information and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileSettings.avatar} alt="Profile" />
                  <AvatarFallback>
                    {profileSettings.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a new profile picture
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="profileName">Full Name</Label>
                  <Input
                    id="profileName"
                    value={profileSettings.name}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="profileEmail">Email Address</Label>
                  <Input
                    id="profileEmail"
                    type="email"
                    value={profileSettings.email}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <Separator />
              
              {/* Password Change Section */}
              <h3 className="text-lg font-medium">Change Password</h3>

              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={profileSettings.currentPassword}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profileSettings.newPassword}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileSettings.confirmPassword}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('profile')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure SMTP settings and email preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SMTP Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>
              </div>

              <Separator />

              {/* Email From Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>
              </div>

              {/* Email Preferences */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Enable email notifications for admin</p>
                  </div>
                  <Switch
                    checked={emailSettings.enableNotifications}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Newsletter Subscriptions</Label>
                    <p className="text-sm text-gray-500">Allow users to subscribe to newsletters</p>
                  </div>
                  <Switch
                    checked={emailSettings.enableNewsletter}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableNewsletter: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Test Email
                </Button>
                <Button onClick={() => handleSave('email')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Search engine optimization and analytics configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Meta Tags */}
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {seoSettings.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {seoSettings.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={seoSettings.keywords}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="Separate keywords with commas"
                />
              </div>

              <Separator />

              {/* Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                  <Input
                    id="googleAnalytics"
                    value={seoSettings.googleAnalytics}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, googleAnalytics: e.target.value }))}
                    placeholder="GA_MEASUREMENT_ID"
                  />
                </div>
                <div>
                  <Label htmlFor="googleSearchConsole">Search Console</Label>
                  <Input
                    id="googleSearchConsole"
                    value={seoSettings.googleSearchConsole}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, googleSearchConsole: e.target.value }))}
                    placeholder="Verification code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixel"
                  value={seoSettings.facebookPixel}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, facebookPixel: e.target.value }))}
                  placeholder="Facebook Pixel ID"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('seo')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Logo Position */}
              <div>
                <Label htmlFor="logoPosition">Logo Position</Label>
                <Select value={appearanceSettings.logoPosition} onValueChange={(value) => setAppearanceSettings(prev => ({ ...prev, logoPosition: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  value={appearanceSettings.footerText}
                  onChange={(e) => setAppearanceSettings(prev => ({ ...prev, footerText: e.target.value }))}
                />
              </div>

              {/* Mode Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-gray-500">Enable dark theme by default</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.darkMode}
                    onCheckedChange={(checked) => setAppearanceSettings(prev => ({ ...prev, darkMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Put the website in maintenance mode</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.maintenanceMode}
                    onCheckedChange={(checked) => setAppearanceSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
              </div>

              {appearanceSettings.maintenanceMode && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Maintenance Mode Active
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    Your website is currently in maintenance mode. Visitors will see a maintenance page.
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => handleSave('appearance')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                API Settings
              </CardTitle>
              <CardDescription>
                Configure external services and API integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium">Cloudinary Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cloudinaryName">Cloud Name</Label>
                  <Input
                    id="cloudinaryName"
                    value={apiSettings.cloudinaryName}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, cloudinaryName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cloudinaryKey">API Key</Label>
                  <Input
                    id="cloudinaryKey"
                    value={apiSettings.cloudinaryKey}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, cloudinaryKey: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cloudinarySecret">API Secret</Label>
                <div className="relative">
                  <Input
                    id="cloudinarySecret"
                    type={showApiKey ? "text" : "password"}
                    value={apiSettings.cloudinarySecret}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, cloudinarySecret: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-medium">Image Analysis API (Auto-Categorization)</h3>
              <p className="text-sm text-gray-500 mb-4">
                Configure AI providers for automatic image categorization when uploading photos
              </p>

              {/* Provider Selection */}
              <div className="mb-4">
                <Label htmlFor="activeProvider">Active Provider</Label>
                <Select 
                  value={imageAnalysisSettings.activeProvider} 
                  onValueChange={(value) => setImageAnalysisSettings(prev => ({ ...prev, activeProvider: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clarifai">Clarifai Community (Recommended - Free)</SelectItem>
                    <SelectItem value="google">Google Vision API</SelectItem>
                    <SelectItem value="azure">Azure AI Vision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clarifai Settings */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="clarifaiApiKey" className="text-base font-semibold">Clarifai Community</Label>
                    <p className="text-sm text-gray-500">
                      Get your API key from{" "}
                      <a 
                        href="https://clarifai.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        https://clarifai.com
                      </a>
                    </p>
                  </div>
                  {imageAnalysisSettings.activeProvider === "clarifai" && (
                    <Badge className="bg-green-600">Active</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clarifaiApiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="clarifaiApiKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter Clarifai API Key (e.g., d9244c0df25e429eb44ce0fb781d97c8)"
                      value={imageAnalysisSettings.clarifaiApiKey}
                      onChange={(e) => setImageAnalysisSettings(prev => ({ ...prev, clarifaiApiKey: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => testApiKey("clarifai")}
                      disabled={testingProvider === "clarifai" || !imageAnalysisSettings.clarifaiApiKey}
                    >
                      {testingProvider === "clarifai" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Google Vision Settings */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="googleApiKey" className="text-base font-semibold">Google Vision API</Label>
                    <p className="text-sm text-gray-500">
                      Get your API key from{" "}
                      <a 
                        href="https://console.cloud.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        https://console.cloud.google.com
                      </a>
                    </p>
                  </div>
                  {imageAnalysisSettings.activeProvider === "google" && (
                    <Badge className="bg-green-600">Active</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleApiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="googleApiKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter Google Vision API Key"
                      value={imageAnalysisSettings.googleApiKey}
                      onChange={(e) => setImageAnalysisSettings(prev => ({ ...prev, googleApiKey: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => testApiKey("google")}
                      disabled={testingProvider === "google" || !imageAnalysisSettings.googleApiKey}
                    >
                      {testingProvider === "google" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Azure Settings */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="azureEndpoint" className="text-base font-semibold">Azure AI Vision</Label>
                    <p className="text-sm text-gray-500">
                      Get your credentials from{" "}
                      <a 
                        href="https://portal.azure.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        https://portal.azure.com
                      </a>
                    </p>
                  </div>
                  {imageAnalysisSettings.activeProvider === "azure" && (
                    <Badge className="bg-green-600">Active</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="azureEndpoint">Endpoint</Label>
                  <Input
                    id="azureEndpoint"
                    placeholder="https://your-name.cognitiveservices.azure.com"
                    value={imageAnalysisSettings.azureEndpoint}
                    onChange={(e) => setImageAnalysisSettings(prev => ({ ...prev, azureEndpoint: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="azureKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="azureKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter Azure API Key"
                      value={imageAnalysisSettings.azureKey}
                      onChange={(e) => setImageAnalysisSettings(prev => ({ ...prev, azureKey: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => testApiKey("azure")}
                      disabled={testingProvider === "azure" || !imageAnalysisSettings.azureEndpoint || !imageAnalysisSettings.azureKey}
                    >
                      {testingProvider === "azure" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">Important:</p>
                    <p className="mb-2">Only one provider can be active at a time. The active provider will be used for automatic image categorization when uploading photos.</p>
                    <p className="font-medium mt-2 mb-1">To use these settings:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Enter your API key above</li>
                      <li>Click the key icon to test the API</li>
                      <li>Add the key to your <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env</code> file:
                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                          <li>Clarifai: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">CLARIFAI_API_KEY=your_key</code></li>
                          <li>Google: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">GOOGLE_VISION_API_KEY=your_key</code></li>
                          <li>Azure: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">AZURE_COMPUTER_VISION_ENDPOINT=your_endpoint</code> and <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">AZURE_COMPUTER_VISION_KEY=your_key</code></li>
                        </ul>
                      </li>
                      <li>Add <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">IMAGE_ANALYSIS_PROVIDER={imageAnalysisSettings.activeProvider}</code> to .env</li>
                      <li>Restart your server for changes to take effect</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-medium">API Access</h3>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable API</Label>
                  <p className="text-sm text-gray-500">Allow external access to your API</p>
                </div>
                <Switch
                  checked={apiSettings.enableApi}
                  onCheckedChange={(checked) => setApiSettings(prev => ({ ...prev, enableApi: checked }))}
                />
              </div>

              {apiSettings.enableApi && (
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="apiKey"
                      value={apiSettings.apiKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={apiSettings.webhookUrl}
                  onChange={(e) => setApiSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSave('api')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Database Settings Tab */}
                      <TabsContent value="database">
                        <div className="space-y-6">
                          {/* Settings Section */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Database className="h-5 w-5 mr-2" />
                                Database Settings
                              </CardTitle>
                              <CardDescription>
                                View all settings stored in the database, grouped by category
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {loadingDatabaseSettings ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="h-6 w-6 animate-spin" />
                                  <span className="ml-2">Loading settings...</span>
                                </div>
                              ) : databaseSettings.categories.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p>No settings found in the database.</p>
                                  <p className="text-sm mt-2">Settings will appear here after you save them from other tabs.</p>
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  {databaseSettings.categories.map((category) => (
                                    <div key={category} className="border rounded-lg p-4">
                                      <h3 className="text-lg font-semibold mb-4 capitalize flex items-center">
                                        <Badge variant="outline" className="mr-2">{category}</Badge>
                                        {databaseSettings.settings[category]?.length || 0} setting(s)
                                      </h3>
                                      <div className="space-y-3">
                                        {databaseSettings.settings[category]?.map((setting) => (
                                          <div key={setting.key} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                                            <div className="flex items-start justify-between">
                                              <div className="flex-1">
                                                <div className="font-medium text-sm text-gray-900 dark:text-white">
                                                  {setting.key}
                                                </div>
                                                {setting.description && (
                                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {setting.description}
                                                  </div>
                                                )}
                                                <div className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-mono bg-white dark:bg-gray-900 p-2 rounded">
                                                  {setting.value ? (
                                                    setting.value.length > 100 ? (
                                                      <span>{setting.value.substring(0, 100)}...</span>
                                                    ) : (
                                                      <span>{setting.value}</span>
                                                    )
                                                  ) : (
                                                    <span className="text-gray-400 italic">(empty)</span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* All Categories Section */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Database className="h-5 w-5 mr-2" />
                                All Categories in Project
                              </CardTitle>
                              <CardDescription>
                                All categories found in galleries, images, and portfolios. These are used for image analysis.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {loadingCategories ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="h-6 w-6 animate-spin" />
                                  <span className="ml-2">Loading categories...</span>
                                </div>
                              ) : allCategories.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No categories found in the database.</p>
                                  <p className="text-sm mt-2">Categories will appear here as you add galleries, images, or portfolios.</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      Found {allCategories.length} unique categor{allCategories.length === 1 ? 'y' : 'ies'}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {allCategories.map((category) => (
                                      <Badge key={category.id} variant="secondary" className="px-3 py-1 text-sm">
                                        {category.name}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                      <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                                      <div className="text-sm text-blue-800 dark:text-blue-300">
                                        <p className="font-medium mb-1">How Categories Work:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                          <li>These categories are automatically detected from your galleries, images, and portfolios</li>
                                          <li>When analyzing images, the AI will match detected labels to these categories</li>
                                          <li>Database categories have higher priority than hardcoded categories</li>
                                          <li>You can add more categories by creating galleries, images, or portfolios with new category names</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )
              }