"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Globe,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Tablet
} from "lucide-react"

// Sample analytics data
const analyticsData = {
  overview: {
    totalVisitors: 28450,
    visitorsChange: 12.5,
    pageViews: 85340,
    pageViewsChange: 8.2,
    avgSessionDuration: "3m 45s",
    sessionChange: -2.1,
    bounceRate: "42.3%",
    bounceRateChange: -5.8,
  },
  topPages: [
    { page: "/", views: 12450, percentage: 35.2 },
    { page: "/gallery", views: 8920, percentage: 25.1 },
    { page: "/portfolio", views: 6780, percentage: 19.1 },
    { page: "/about", views: 4320, percentage: 12.2 },
    { page: "/services", views: 2980, percentage: 8.4 },
  ],
  trafficSources: [
    { source: "Organic Search", visitors: 15620, percentage: 54.9 },
    { source: "Direct", visitors: 7840, percentage: 27.6 },
    { source: "Social Media", visitors: 3210, percentage: 11.3 },
    { source: "Referrals", visitors: 1780, percentage: 6.2 },
  ],
  devices: [
    { device: "Desktop", users: 16890, percentage: 59.4 },
    { device: "Mobile", users: 9760, percentage: 34.3 },
    { device: "Tablet", users: 1800, percentage: 6.3 },
  ],
  recentActivity: [
    { event: "New gallery created", time: "2 minutes ago", type: "content" },
    { event: "Blog post published", time: "1 hour ago", type: "content" },
    { event: "Contact form submitted", time: "3 hours ago", type: "interaction" },
    { event: "Portfolio updated", time: "5 hours ago", type: "content" },
    { event: "New user registration", time: "1 day ago", type: "user" },
  ],
  monthlyData: [
    { month: "Jan", visitors: 18420, pageViews: 45230 },
    { month: "Feb", visitors: 22150, pageViews: 52340 },
    { month: "Mar", visitors: 19880, pageViews: 47820 },
    { month: "Apr", visitors: 24780, pageViews: 58960 },
    { month: "May", visitors: 26340, pageViews: 62180 },
    { month: "Jun", visitors: 28450, pageViews: 68340 },
  ],
  topKeywords: [
    { keyword: "wedding photographer", searches: 2840, position: 3 },
    { keyword: "portrait photography", searches: 1950, position: 5 },
    { keyword: "professional photographer", searches: 1650, position: 7 },
    { keyword: "corporate headshots", searches: 980, position: 4 },
    { keyword: "event photography", searches: 720, position: 8 },
  ]
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30d")

  const StatCard = ({ title, value, change, icon: Icon, suffix = "" }) => {
    const isPositive = change > 0
    const isNeutral = change === 0
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {typeof value === "number" ? value.toLocaleString() : value}{suffix}
                </p>
                {!isNeutral && (
                  <div className={`flex items-center text-sm ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    <span>{Math.abs(change)}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isPositive ? "bg-green-100 dark:bg-green-900" : 
              isNeutral ? "bg-gray-100 dark:bg-gray-800" : "bg-red-100 dark:bg-red-900"
            }`}>
              <Icon className={`h-6 w-6 ${
                isPositive ? "text-green-600 dark:text-green-400" : 
                isNeutral ? "text-gray-600 dark:text-gray-400" : "text-red-600 dark:text-red-400"
              }`} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your website performance and visitor insights
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visitors"
          value={analyticsData.overview.totalVisitors}
          change={analyticsData.overview.visitorsChange}
          icon={Users}
        />
        <StatCard
          title="Page Views"
          value={analyticsData.overview.pageViews}
          change={analyticsData.overview.pageViewsChange}
          icon={Eye}
        />
        <StatCard
          title="Avg. Session Duration"
          value={analyticsData.overview.avgSessionDuration}
          change={analyticsData.overview.sessionChange}
          icon={Clock}
        />
        <StatCard
          title="Bounce Rate"
          value={analyticsData.overview.bounceRate}
          change={analyticsData.overview.bounceRateChange}
          icon={MousePointer}
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited pages on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {page.page}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {page.percentage}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                    {page.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Traffic Sources
            </CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {source.source}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {source.percentage}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                    {source.visitors.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Analytics and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Device Breakdown
            </CardTitle>
            <CardDescription>Visitor device preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.devices.map((device, index) => {
                const Icon = device.device === "Desktop" ? Monitor : 
                           device.device === "Mobile" ? Smartphone : Tablet
                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {device.device}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {device.users.toLocaleString()} users
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {device.percentage}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest website activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "content" ? "bg-blue-500" :
                    activity.type === "interaction" ? "bg-green-500" :
                    "bg-purple-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.event}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends and Top Keywords */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Monthly Trends
            </CardTitle>
            <CardDescription>6-month visitor and page view trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {month.month}
                      </span>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>{month.visitors.toLocaleString()} visitors</span>
                        <span>{month.pageViews.toLocaleString()} views</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${(month.visitors / 30000) * 100}%` }}
                        />
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{ width: `${(month.pageViews / 70000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Visitors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1.5 bg-green-600 rounded-full"></div>
                <span>Page Views</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Keywords
            </CardTitle>
            <CardDescription>Search terms bringing traffic to your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {keyword.keyword}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          #{keyword.position}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {keyword.searches} searches
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(keyword.searches / 3000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Insights
          </CardTitle>
          <CardDescription>Key performance indicators and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  Growing Traffic
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-400">
                Your website traffic has increased by 12.5% this month. Keep up the great content!
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  High Engagement
                </span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Gallery pages have the highest engagement rate. Consider adding more portfolio content.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2 mb-2">
                <MousePointer className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Bounce Rate Improved
                </span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                Your bounce rate decreased by 5.8%. The new website design is working well!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common analytics tasks and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span className="text-sm">Export Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Audience Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Globe className="h-6 w-6 mb-2" />
              <span className="text-sm">Traffic Sources</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Goals & Conversions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}