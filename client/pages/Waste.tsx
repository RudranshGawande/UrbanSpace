import { useState, useEffect } from "react";
import {
  Trash2,
  Recycle,
  Leaf,
  Calendar,
  Clock,
  MapPin,
  Bell,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Truck,
  Info,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WasteSchedule {
  id: string;
  type: "general" | "recycling" | "organic" | "hazardous";
  name: string;
  nextPickup: Date;
  frequency: string;
  area: string;
  status: "scheduled" | "collected" | "missed" | "delayed";
  timeSlot: string;
  instructions?: string;
}

interface WasteStats {
  totalCollected: number;
  recyclingRate: number;
  wasteReduced: number;
  nextPickup: string;
}

const mockSchedule: WasteSchedule[] = [
  {
    id: "1",
    type: "general",
    name: "General Waste",
    nextPickup: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    frequency: "Twice a week",
    area: "Sector 7, Block A",
    status: "scheduled",
    timeSlot: "7:00 AM - 9:00 AM",
    instructions: "Place bins outside by 6:30 AM",
  },
  {
    id: "2",
    type: "recycling",
    name: "Recyclables",
    nextPickup: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    frequency: "Weekly",
    area: "Sector 7, Block A",
    status: "scheduled",
    timeSlot: "8:00 AM - 10:00 AM",
    instructions: "Clean containers and separate materials",
  },
  {
    id: "3",
    type: "organic",
    name: "Organic Waste",
    nextPickup: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    frequency: "Weekly",
    area: "Sector 7, Block A",
    status: "scheduled",
    timeSlot: "6:00 AM - 8:00 AM",
    instructions: "Use compostable bags only",
  },
  {
    id: "4",
    type: "hazardous",
    name: "Hazardous Waste",
    nextPickup: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
    frequency: "Monthly",
    area: "Sector 7, Block A",
    status: "scheduled",
    timeSlot: "10:00 AM - 12:00 PM",
    instructions: "Special collection - register in advance",
  },
];

const mockStats: WasteStats = {
  totalCollected: 847,
  recyclingRate: 68,
  wasteReduced: 23,
  nextPickup: "Tomorrow at 7:00 AM",
};

export default function Waste() {
  const [schedule, setSchedule] = useState<WasteSchedule[]>(mockSchedule);
  const [stats, setStats] = useState<WasteStats>(mockStats);
  const [filter, setFilter] = useState<"all" | WasteSchedule["type"]>("all");
  const [notifications, setNotifications] = useState(true);

  const filteredSchedule = schedule.filter((item) =>
    filter === "all" ? true : item.type === filter
  );

  const getWasteIcon = (type: WasteSchedule["type"]) => {
    switch (type) {
      case "general":
        return Trash2;
      case "recycling":
        return Recycle;
      case "organic":
        return Leaf;
      case "hazardous":
        return AlertTriangle;
      default:
        return Trash2;
    }
  };

  const getWasteColor = (type: WasteSchedule["type"]) => {
    switch (type) {
      case "general":
        return "bg-gray-500";
      case "recycling":
        return "bg-blue-500";
      case "organic":
        return "bg-green-500";
      case "hazardous":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: WasteSchedule["status"]) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100";
      case "collected":
        return "text-green-600 bg-green-100";
      case "missed":
        return "text-red-600 bg-red-100";
      case "delayed":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const upcomingPickups = schedule
    .filter((item) => item.status === "scheduled")
    .sort((a, b) => a.nextPickup.getTime() - b.nextPickup.getTime())
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Waste Management
              </h1>
              <p className="text-muted-foreground">
                Track pickup schedules and manage your waste efficiently
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Notifications {notifications ? "On" : "Off"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Your area: Sector 7, Block A</span>
            </div>

            {/* Filter */}
            <div className="flex bg-muted rounded-lg p-1">
              {["all", "general", "recycling", "organic", "hazardous"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type as typeof filter)}
                    className={cn(
                      "px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize",
                      filter === type
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold">{stats.totalCollected} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Recycle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recycling Rate</p>
                <p className="text-2xl font-bold">{stats.recyclingRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waste Reduced</p>
                <p className="text-2xl font-bold">{stats.wasteReduced}%</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Pickup</p>
                <p className="text-lg font-bold">{stats.nextPickup}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Pickups Alert */}
        {upcomingPickups.length > 0 && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Upcoming Pickups
                </h3>
                <div className="space-y-2">
                  {upcomingPickups.map((pickup) => (
                    <div
                      key={pickup.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {pickup.name} - {formatDate(pickup.nextPickup)}
                      </span>
                      <span className="font-medium text-foreground">
                        {pickup.timeSlot}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Collection Schedule
          </h2>

          {filteredSchedule.map((item) => {
            const Icon = getWasteIcon(item.type);
            return (
              <div
                key={item.id}
                className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                        getWasteColor(item.type)
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getStatusColor(item.status)
                          )}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.nextPickup)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{item.area}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Frequency
                    </p>
                    <p className="font-medium">{item.frequency}</p>
                  </div>
                </div>

                {item.instructions && (
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {item.instructions}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredSchedule.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No {filter} waste schedules found
            </p>
          </div>
        )}

        {/* Waste Sorting Guide */}
        <div className="mt-12 bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Waste Sorting Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                type: "general",
                items: ["Food scraps", "Non-recyclable plastics", "Mixed waste"],
                color: "bg-gray-500",
              },
              {
                type: "recycling",
                items: ["Paper", "Cardboard", "Clean plastic containers"],
                color: "bg-blue-500",
              },
              {
                type: "organic",
                items: ["Vegetable waste", "Garden trimmings", "Compostables"],
                color: "bg-green-500",
              },
              {
                type: "hazardous",
                items: ["Batteries", "Electronics", "Chemicals"],
                color: "bg-red-500",
              },
            ].map((guide) => {
              const Icon = getWasteIcon(guide.type as WasteSchedule["type"]);
              return (
                <div key={guide.type} className="text-center">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-xl flex items-center justify-center text-white mx-auto mb-3",
                      guide.color
                    )}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2 capitalize">
                    {guide.type} Waste
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {guide.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
