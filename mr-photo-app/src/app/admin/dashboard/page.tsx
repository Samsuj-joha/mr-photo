"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Images,
  Briefcase,
  FileText,
  Eye,
  TrendingUp,
  Camera,
  MessageSquare,
  Users,
  Star,
  Activity,
  Plus,
  ArrowUpRight,
} from "lucide-react"

const stats = [
  {
    title: "Total Photos",
    value: "2,847",
    change: "+12%",
    changeType: "positive",
    icon: Images,
    description: "In 45 galleries",
  },
  {
    title: "Portfolio Projects",
    value: "127",
    change: "+8%",
    changeType: "positive", 
    icon: Briefcase,
    description: "23 featured",
  },
  {
    title: "Blog Posts",
    value: "89",
    change: "+5%",
    changeType: "positive",
    icon: FileText,
    description: "12 published this month",
  },
  {
    title: "Site Views",
    value: "18.2K",
    change: "+23%",
    changeType: "positive",
    icon: Eye,
    description: "This month",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "upload",
    title: "New gallery uploaded",
    description: "Wedding Collection - Sarah & Mike",
    time: "2 minutes ago",
    icon: Camera,
    status: "completed",
  },
  {
    id: 2,
    type: "message",
    title: "New contact message",
    description: "Emma Davis inquiring about portrait session",
    time: "15 minutes ago",
    icon: MessageSquare,
    status: "pending",
  },
  {
    id: 3,
    type: "blog",
    title: "Blog post published",
    description: "10 Essential Portrait Photography Tips",
    time: "2 hours ago",
    icon: FileText,
    status: "completed",
  },
]

const quickActions = [
  {
    title: "Upload Photos",
    description: "Add new photos to gallery",
    icon: Camera,
    href: "/admin/gallery",
    color: "bg-blue-500",
  },
  {
    title: "Create Portfolio",
    description: "Add new portfolio project",
    icon: Briefcase,
    href: "/admin/portfolio",
    color: "bg-green-500",
  },
  {
    title: "Write Blog Post",
    description: "Create new blog article",
    icon: FileText,
    href: "/admin/blog",
    color: "bg-purple-500",
  },
  {
    title: "View Messages",
    description: "Check contact inquiries",
    icon: MessageSquare,
    href: "/admin/messages",
    color: "bg-orange-500",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-light text-lg tracking-wider">MR</span>
              </div>
              <div>
                <h1 className="text-3xl font-light mb-1">Welcome back, Admin! 👋</h1>
                <p className="text-gray-100 text-lg font-light">
                  Here's what's happening with MR Photography today.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Activity className="h-8 w-8 text-white mb-2" />
              <div className="text-sm text-gray-100">Status</div>
              <div className="font-semibold">All Systems Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your photography business</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.status === "completed" 
                    ? "bg-green-100 dark:bg-green-900" 
                    : "bg-yellow-100 dark:bg-yellow-900"
                }`}>
                  <activity.icon className={`h-4 w-4 ${
                    activity.status === "completed"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h4>
                    <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}