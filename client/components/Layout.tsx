import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Bus,
  Trash2,
  AlertTriangle,
  Search,
  Calendar,
  Phone,
  MessageSquare,
  Menu,
  X,
  Zap,
  Cpu,
  Wifi,
  User,
  Settings,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Home", href: "/", icon: MapPin },
  { name: "Transport", href: "/transport", icon: Bus },
  { name: "Waste", href: "/waste", icon: Trash2 },
  { name: "Report Issue", href: "/report", icon: AlertTriangle },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Emergency", href: "/emergency", icon: Phone },
  { name: "Community", href: "/community", icon: MessageSquare },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || !isHomePage
            ? "bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl"
            : "bg-slate-950/80 backdrop-blur-md border-b border-slate-800/30"
        )}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  CityScape
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Neural Urban OS
                </p>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group relative"
                  >
                    {isActive && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-70 animate-pulse" />
                    )}
                    <div
                      className={cn(
                        "relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-slate-800/80 text-cyan-400 shadow-lg border border-cyan-500/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Status Indicators & Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Neural Status */}
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Neural Active</span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-1">
                <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Enhanced Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 transition-all duration-200"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={cn(
                    "absolute inset-0 w-6 h-6 transition-all duration-200",
                    isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 w-6 h-6 transition-all duration-200",
                    isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden transition-all duration-300 overflow-hidden",
            isMobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group relative block"
                  >
                    {isActive && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-50" />
                    )}
                    <div
                      className={cn(
                        "relative flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-slate-800/80 text-cyan-400 border border-cyan-500/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </Link>
                );
              })}

              {/* Mobile Status & Actions */}
              <div className="pt-4 mt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Cpu className="w-4 h-4 text-green-400" />
                    <span>Neural Network: Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-blue-400" />
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with proper spacing */}
      <main className="pt-16">{children}</main>

      {/* Enhanced Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navigation.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group relative"
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-lg" />
                  )}
                  <div
                    className={cn(
                      "relative flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-medium transition-all duration-200",
                      isActive
                        ? "text-cyan-400"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] leading-tight">{item.name}</span>
                    {isActive && (
                      <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile spacing for bottom nav */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
