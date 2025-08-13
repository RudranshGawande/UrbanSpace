import { Link } from "react-router-dom";
import {
  Bus,
  Trash2,
  AlertTriangle,
  Search,
  Calendar,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Users,
  Zap,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Bus,
    title: "Live Transport",
    description: "Real-time bus and train tracking with arrival times",
    href: "/transport",
    color: "bg-blue-500",
    stats: "5 routes nearby",
  },
  {
    icon: Trash2,
    title: "Waste Collection",
    description: "Get alerts for pickup schedules in your area",
    href: "/waste",
    color: "bg-green-500",
    stats: "Next: Tomorrow 7AM",
  },
  {
    icon: AlertTriangle,
    title: "Report Issues",
    description: "Report infrastructure problems with photos & location",
    href: "/report",
    color: "bg-orange-500",
    stats: "3 active reports",
  },
  {
    icon: Search,
    title: "Lost & Found",
    description: "Community-powered lost and found portal",
    href: "/lost-found",
    color: "bg-purple-500",
    stats: "12 active listings",
  },
  {
    icon: Calendar,
    title: "Local Events",
    description: "Discover what's happening in your neighborhood",
    href: "/events",
    color: "bg-pink-500",
    stats: "4 events this week",
  },
  {
    icon: Phone,
    title: "Emergency",
    description: "Quick access to emergency contacts and SOS",
    href: "/emergency",
    color: "bg-red-500",
    stats: "Always available",
  },
  {
    icon: MessageSquare,
    title: "Community Chat",
    description: "Connect with neighbors and stay informed",
    href: "/community",
    color: "bg-indigo-500",
    stats: "89 active members",
  },
];

const quickStats = [
  { label: "Active Users", value: "2,847", icon: Users, trend: "+12%" },
  { label: "Issues Resolved", value: "156", icon: CheckCircle, trend: "+23%" },
  { label: "Response Time", value: "< 2hrs", icon: Clock, trend: "-15%" },
];

const recentActivity = [
  {
    type: "transport",
    message: "Bus Route 24 - Delayed by 5 minutes",
    time: "2 min ago",
    icon: Bus,
    color: "text-blue-600",
  },
  {
    type: "waste",
    message: "Waste collection reminder for tomorrow",
    time: "1 hour ago",
    icon: Trash2,
    color: "text-green-600",
  },
  {
    type: "event",
    message: "Community BBQ this Saturday at Central Park",
    time: "3 hours ago",
    icon: Calendar,
    color: "text-pink-600",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {" "}
                CityScape
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your smart companion for urban living. Track transport, manage
              waste, report issues, and connect with your community.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access all essential city services and community features in one
            place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.href}
                className="group bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0",
                      feature.color,
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-medium text-accent">
                        {feature.stats}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Activity
            </h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Bell className="w-4 h-4" />
              <span>Live updates</span>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon className={cn("w-5 h-5", activity.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Link
              to="/community"
              className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              <span>View all activity</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
