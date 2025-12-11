// src/app/admin/gallery/settings/page.tsx - API Settings for Image Analysis
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Key,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Database
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface ApiProvider {
  name: string
  key: string
  endpoint?: string
  active: boolean
}

export default function GalleryApiSettings() {
  const [activeTab, setActiveTab] = useState("clarifai")
  const [isLoading, setIsLoading] = useState(false)
  const [testingKey, setTestingKey] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  // API Settings State
  const [providers, setProviders] = useState({
    google: {
      name: "Google Vision API",
      apiKey: "",
      active: false
    },
    clarifai: {
      name: "Clarifai Community",
      apiKey: "",
      active: false
    },
    azure: {
      name: "Azure AI Vision",
      endpoint: "",
      apiKey: "",
      active: false
    }
  })

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/image-analysis')
      if (response.ok) {
        const data = await response.json()
        const activeProvider = data.activeProvider || "clarifai"
        
        // Always load the API keys from the response (they come from database now)
        setProviders(prev => ({
          ...prev,
          google: {
            ...prev.google,
            apiKey: data.googleApiKey || "",
            active: activeProvider === "google"
          },
          clarifai: {
            ...prev.clarifai,
            apiKey: data.clarifaiApiKey || "",
            active: activeProvider === "clarifai"
          },
          azure: {
            ...prev.azure,
            endpoint: data.azureEndpoint || "",
            apiKey: data.azureKey || "",
            active: activeProvider === "azure"
          }
        }))

        // Set active tab to the active provider
        if (activeProvider === "google") setActiveTab("google")
        else if (activeProvider === "azure") setActiveTab("azure")
        else setActiveTab("clarifai")
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  // Test API Key
  const testApiKey = async (provider: string) => {
    setTestingKey(provider)
    try {
      let testResult = { success: false, message: "" }
      
      if (provider === "clarifai") {
        if (!providers.clarifai.apiKey) {
          toast.error("Please enter Clarifai API key first")
          return
        }
        const response = await fetch("https://api.clarifai.com/v2/users/clarifai/apps/main/models", {
          headers: {
            "Authorization": `Key ${providers.clarifai.apiKey}`,
            "Content-Type": "application/json",
          },
        })
        if (response.ok) {
          toast.success("Clarifai API is working!")
        } else {
          toast.error("Invalid Clarifai API key")
        }
      } else if (provider === "google") {
        if (!providers.google.apiKey) {
          toast.error("Please enter Google Vision API key first")
          return
        }
        const response = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${providers.google.apiKey}`,
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
          toast.error(`Google Vision API Error: ${data.error.message}`)
        } else {
          toast.success("Google Vision API is working!")
        }
      } else if (provider === "azure") {
        if (!providers.azure.endpoint || !providers.azure.apiKey) {
          toast.error("Please enter Azure endpoint and key first")
          return
        }
        const response = await fetch(`${providers.azure.endpoint}/vision/v3.2/models`, {
          headers: { "Ocp-Apim-Subscription-Key": providers.azure.apiKey },
        })
        if (response.ok) {
          toast.success("Azure AI Vision is working!")
        } else {
          toast.error(`Azure Vision API Error: ${response.statusText}`)
        }
      }
    } catch (error: any) {
      toast.error(`Connection error: ${error.message}`)
    } finally {
      setTestingKey(null)
    }
  }

  // Save API Key
  const saveApiKey = async (provider: string) => {
    setIsLoading(true)
    try {
      let apiKey = ""
      let endpoint = ""

      if (provider === "clarifai") {
        if (!providers.clarifai.apiKey) {
          toast.error("Please enter Clarifai API key")
          setIsLoading(false)
          return
        }
        apiKey = providers.clarifai.apiKey
      } else if (provider === "google") {
        if (!providers.google.apiKey) {
          toast.error("Please enter Google Vision API key")
          setIsLoading(false)
          return
        }
        apiKey = providers.google.apiKey
      } else if (provider === "azure") {
        if (!providers.azure.endpoint || !providers.azure.apiKey) {
          toast.error("Please enter Azure endpoint and key")
          setIsLoading(false)
          return
        }
        apiKey = providers.azure.apiKey
        endpoint = providers.azure.endpoint
      }

      const response = await fetch('/api/admin/settings/image-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeProvider: providers.clarifai.active ? "clarifai" : 
                        providers.google.active ? "google" : 
                        providers.azure.active ? "azure" : provider,
          googleApiKey: provider === "google" ? apiKey : providers.google.apiKey,
          clarifaiApiKey: provider === "clarifai" ? apiKey : providers.clarifai.apiKey,
          azureEndpoint: provider === "azure" ? endpoint : providers.azure.endpoint,
          azureKey: provider === "azure" ? apiKey : providers.azure.apiKey,
        }),
      })

      if (response.ok) {
        toast.success("API key saved! Please add it to your .env file and restart the server.")
        // Don't reload settings - keep the API key visible in the form
      } else {
        toast.error('Failed to save API key')
      }
    } catch (error) {
      console.error("Error saving API key:", error)
      toast.error("Failed to save API key")
    } finally {
      setIsLoading(false)
    }
  }

  // Activate Provider
  const activateProvider = async (provider: string) => {
    setIsLoading(true)
    try {
      // Check if API key is provided
      let hasApiKey = false
      if (provider === "clarifai") {
        hasApiKey = !!providers.clarifai.apiKey
        if (!hasApiKey) {
          toast.error("Please enter Clarifai API key first")
          setIsLoading(false)
          return
        }
      } else if (provider === "google") {
        hasApiKey = !!providers.google.apiKey
        if (!hasApiKey) {
          toast.error("Please enter Google Vision API key first")
          setIsLoading(false)
          return
        }
      } else if (provider === "azure") {
        hasApiKey = !!providers.azure.apiKey && !!providers.azure.endpoint
        if (!hasApiKey) {
          toast.error("Please enter Azure endpoint and API key first")
          setIsLoading(false)
          return
        }
      }

      // Activate the provider (this also saves the API key)
      const response = await fetch('/api/admin/settings/image-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeProvider: provider,
          googleApiKey: providers.google.apiKey,
          clarifaiApiKey: providers.clarifai.apiKey,
          azureEndpoint: providers.azure.endpoint,
          azureKey: providers.azure.apiKey,
        }),
      })

      if (response.ok) {
        // Update active status locally without reloading (to preserve API keys)
        setProviders(prev => ({
          ...prev,
          google: { ...prev.google, active: provider === "google" },
          clarifai: { ...prev.clarifai, active: provider === "clarifai" },
          azure: { ...prev.azure, active: provider === "azure" }
        }))
        toast.success("Provider activated successfully!")
      } else {
        toast.error('Failed to activate provider')
      }
    } catch (error) {
      console.error("Error activating provider:", error)
      toast.error("Failed to activate provider")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete API Key
  const deleteApiKey = (provider: string) => {
    if (confirm(`Are you sure you want to delete the ${provider} API key?`)) {
      if (provider === "google") {
        setProviders(prev => ({
          ...prev,
          google: { ...prev.google, apiKey: "" }
        }))
      } else if (provider === "clarifai") {
        setProviders(prev => ({
          ...prev,
          clarifai: { ...prev.clarifai, apiKey: "" }
        }))
      } else if (provider === "azure") {
        setProviders(prev => ({
          ...prev,
          azure: { ...prev.azure, apiKey: "", endpoint: "" }
        }))
      }
      toast.success("API key removed from form")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          API Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure image analysis providers
        </p>
      </div>

      {/* Provider Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="google">Google Vision API</TabsTrigger>
          <TabsTrigger value="clarifai">Clarifai Community</TabsTrigger>
          <TabsTrigger value="azure">Azure AI Vision</TabsTrigger>
        </TabsList>

        {/* Google Vision API Tab */}
        <TabsContent value="google">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Google Vision API</CardTitle>
                  <CardDescription className="mt-2">
                    Get your API key from{" "}
                    <a
                      href="https://console.cloud.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 underline"
                    >
                      https://console.cloud.google.com
                      <ExternalLink className="inline h-3 w-3 ml-1" />
                    </a>
                  </CardDescription>
                </div>
                {providers.google.active && (
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-api-key">Enter API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="google-api-key"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter Google Vision API Key"
                      value={providers.google.apiKey}
                      onChange={(e) =>
                        setProviders(prev => ({
                          ...prev,
                          google: { ...prev.google, apiKey: e.target.value }
                        }))
                      }
                      className={providers.google.active ? "pr-20" : "pr-12"}
                    />
                    {providers.google.apiKey && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => deleteApiKey("google")}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => testApiKey("google")}
                  disabled={testingKey === "google" || !providers.google.apiKey}
                >
                  {testingKey === "google" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Test API Key
                </Button>
                <Button
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => activateProvider("google")}
                  disabled={isLoading || !providers.google.apiKey}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Key className="h-4 w-4 mr-2" />
                  )}
                  Activate This Provider
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clarifai Community Tab */}
        <TabsContent value="clarifai">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Clarifai Community</CardTitle>
                  <CardDescription className="mt-2">
                    Get your API key from{" "}
                    <a
                      href="https://clarifai.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 underline"
                    >
                      https://clarifai.com
                      <ExternalLink className="inline h-3 w-3 ml-1" />
                    </a>
                  </CardDescription>
                </div>
                {providers.clarifai.active && (
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clarifai-api-key">Enter API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    {providers.clarifai.active && providers.clarifai.apiKey && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    )}
                    <Input
                      id="clarifai-api-key"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter Clarifai API Key"
                      value={providers.clarifai.apiKey}
                      onChange={(e) =>
                        setProviders(prev => ({
                          ...prev,
                          clarifai: { ...prev.clarifai, apiKey: e.target.value }
                        }))
                      }
                      className={providers.clarifai.active && providers.clarifai.apiKey ? "pl-20" : ""}
                    />
                    {providers.clarifai.apiKey && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => deleteApiKey("clarifai")}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => testApiKey("clarifai")}
                  disabled={testingKey === "clarifai" || !providers.clarifai.apiKey}
                >
                  {testingKey === "clarifai" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Test API Key
                </Button>
                <Button
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => activateProvider("clarifai")}
                  disabled={isLoading || !providers.clarifai.apiKey}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Key className="h-4 w-4 mr-2" />
                  )}
                  Activate This Provider
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Azure AI Vision Tab */}
        <TabsContent value="azure">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Azure AI Vision</CardTitle>
                  <CardDescription className="mt-2">
                    Get your credentials from{" "}
                    <a
                      href="https://portal.azure.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 underline"
                    >
                      https://portal.azure.com
                      <ExternalLink className="inline h-3 w-3 ml-1" />
                    </a>
                    {" "}•{" "}
                    <a
                      href="/AZURE_VISION_SETUP_GUIDE.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 underline"
                    >
                      View Setup Guide
                      <ExternalLink className="inline h-3 w-3 ml-1" />
                    </a>
                  </CardDescription>
                </div>
                {providers.azure.active && (
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Setup Instructions */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
                  Quick Setup Steps:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="underline">Azure Portal</a></li>
                  <li>Create a "Computer Vision" resource</li>
                  <li>Copy the Endpoint and KEY 1 from "Keys and Endpoint" section</li>
                  <li>Paste them below and click "Activate This Provider"</li>
                </ol>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  💡 Free tier available: 5,000 calls/month at no cost!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="azure-endpoint">
                  Endpoint URL
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="azure-endpoint"
                  placeholder="https://your-name.cognitiveservices.azure.com"
                  value={providers.azure.endpoint}
                  onChange={(e) =>
                    setProviders(prev => ({
                      ...prev,
                      azure: { ...prev.azure, endpoint: e.target.value }
                    }))
                  }
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Found in Azure Portal → Your Computer Vision resource → Keys and Endpoint
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="azure-api-key">
                  API Key (KEY 1)
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="azure-api-key"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter Azure API Key (KEY 1)"
                      value={providers.azure.apiKey}
                      onChange={(e) =>
                        setProviders(prev => ({
                          ...prev,
                          azure: { ...prev.azure, apiKey: e.target.value }
                        }))
                      }
                      className={providers.azure.apiKey ? "pr-12" : ""}
                    />
                    {providers.azure.apiKey && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => deleteApiKey("azure")}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Copy KEY 1 from Azure Portal → Keys and Endpoint section
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => testApiKey("azure")}
                  disabled={testingKey === "azure" || !providers.azure.apiKey || !providers.azure.endpoint}
                >
                  {testingKey === "azure" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Test API Key
                </Button>
                <Button
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => activateProvider("azure")}
                  disabled={isLoading || !providers.azure.apiKey || !providers.azure.endpoint}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Key className="h-4 w-4 mr-2" />
                  )}
                  Activate This Provider
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Important Note */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Only one provider can be active at a time.
          </p>
        </div>
      </div>
    </div>
  )
}

