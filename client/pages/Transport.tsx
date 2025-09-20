import { useState, useEffect } from "react";
import {
  Bus,
  Train,
  MapPin,
  Clock,
  Navigation,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Route {
  id: string;
  number: string;
  name: string;
  type: "bus" | "train";
  status: "on-time" | "delayed" | "cancelled";
  estimatedArrival: string;
  delay?: number;
  capacity: number;
  nextStops: string[];
  distance: string;
}

const mockRoutes: Route[] = [
  {
    id: "1",
    number: "24",
    name: "Downtown Express",
    type: "bus",
    status: "delayed",
    estimatedArrival: "3 min",
    delay: 5,
    capacity: 78,
    nextStops: ["Central Station", "City Hall", "University"],
    distance: "0.2 km",
  },
  {
    id: "2",
    number: "A1",
    name: "Metro Line A",
    type: "train",
    status: "on-time",
    estimatedArrival: "7 min",
    capacity: 45,
    nextStops: ["North Terminal", "Commerce Center", "Airport"],
    distance: "0.5 km",
  },
  {
    id: "3",
    number: "42",
    name: "Circular Route",
    type: "bus",
    status: "on-time",
    estimatedArrival: "12 min",
    capacity: 23,
    nextStops: ["Shopping Mall", "Hospital", "Sports Complex"],
    distance: "0.8 km",
  },
  {
    id: "4",
    number: "B2",
    name: "East Line",
    type: "train",
    status: "on-time",
    estimatedArrival: "15 min",
    capacity: 67,
    nextStops: ["Tech Park", "University", "Residential Zone"],
    distance: "1.2 km",
  },
];

const SNAP_KEY = "cityscape_transport_snapshot";

function writeSnapshot(routes: Route[]) {
  try {
    const snapshot = {
      lastUpdatedISO: new Date().toISOString(),
      routes: routes.map((r) => ({
        id: r.id,
        number: r.number,
        name: r.name,
        type: r.type,
        status: r.status,
        estimatedArrival: r.estimatedArrival,
        delay: r.delay ?? null,
        capacity: r.capacity,
        distance: r.distance,
      })),
    };
    localStorage.setItem(SNAP_KEY, JSON.stringify(snapshot));
  } catch {}
}

export default function Transport() {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [filter, setFilter] = useState<"all" | "bus" | "train">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const filteredRoutes = routes.filter((route) =>
    filter === "all" ? true : route.type === filter,
  );

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    // write initial snapshot on mount
    writeSnapshot(routes);
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // persist snapshot whenever data is refreshed or routes change
    writeSnapshot(routes);
  }, [lastUpdated, routes]);

  const getStatusColor = (status: Route["status"]) => {
    switch (status) {
      case "on-time":
        return "text-green-600 bg-green-100";
      case "delayed":
        return "text-orange-600 bg-orange-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 80) return "bg-red-500";
    if (capacity >= 60) return "bg-orange-500";
    if (capacity >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Live Transport
              </h1>
              <p className="text-muted-foreground">
                Real-time arrivals and route information
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              />
              <span>Refresh</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>

            {/* Filter */}
            <div className="flex bg-muted rounded-lg p-1">
              {["all", "bus", "train"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as typeof filter)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize",
                    filter === type
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Buses</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Train className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Trains</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delays</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Wait</p>
                <p className="text-xl font-bold">8 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Routes List */}
        <div className="space-y-4">
          {filteredRoutes.map((route) => {
            const Icon = route.type === "bus" ? Bus : Train;
            return (
              <div
                key={route.id}
                className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                        route.type === "bus" ? "bg-blue-500" : "bg-green-500",
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {route.type === "bus" ? "Bus" : "Train"}{" "}
                          {route.number}
                        </h3>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getStatusColor(route.status),
                          )}
                        >
                          {route.status === "on-time"
                            ? "On Time"
                            : route.status === "delayed"
                              ? `Delayed ${route.delay}min`
                              : "Cancelled"}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{route.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{route.distance} away</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Arrives in {route.estimatedArrival}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-muted-foreground">
                        Capacity
                      </span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            getCapacityColor(route.capacity),
                          )}
                          style={{ width: `${route.capacity}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {route.capacity}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Next stops:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {route.nextStops.slice(0, 3).map((stop, index) => (
                      <span
                        key={index}
                        className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {stop}
                      </span>
                    ))}
                    {route.nextStops.length > 3 && (
                      <span className="text-sm text-muted-foreground">
                        +{route.nextStops.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No {filter} routes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
