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
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Bus,
    title: "Live Transport",
    description: "Real-time bus and train tracking with arrival times",
    href: "/transport",
    color: "bg-blue-500",
    stats: "5 routes nearby"
  },
  {
    icon: Trash2,
    title: "Waste Collection",
    description: "Get alerts for pickup schedules in your area",
    href: "/waste",
    color: "bg-green-500",
    stats: "Next: Tomorrow 7AM"
  },
  {
    icon: AlertTriangle,
    title: "Report Issues",
    description: "Report infrastructure problems with photos & location",
    href: "/report",
    color: "bg-orange-500",
    stats: "3 active reports"
  },
  {
    icon: Search,
    title: "Lost & Found",
    description: "Community-powered lost and found portal",
    href: "/lost-found",
    color: "bg-purple-500",
    stats: "12 active listings"
  },
  {
    icon: Calendar,
    title: "Local Events",
    description: "Discover what's happening in your neighborhood",
    href: "/events",
    color: "bg-pink-500",
    stats: "4 events this week"
  },
  {
    icon: Phone,
    title: "Emergency",
    description: "Quick access to emergency contacts and SOS",
    href: "/emergency",
    color: "bg-red-500",
    stats: "Always available"
  },
  {
    icon: MessageSquare,
    title: "Community Chat",
    description: "Connect with neighbors and stay informed",
    href: "/community",
    color: "bg-indigo-500",
    stats: "89 active members"
  }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Urban Space
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your smart companion for urban living. Track transport, manage waste, report issues, and connect with your community.
          </p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentActivities />
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">City Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access all essential city services and community features in one place
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.href}
                className="group bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-between">
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
    </div>
  );
}
