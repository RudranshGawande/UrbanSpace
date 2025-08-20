import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Sparkles,
  Globe,
  Shield,
  Cpu,
  Wifi,
  Activity,
  BarChart3,
  Brain,
  Atom,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Bus,
    title: "AI Transport",
    description: "Neural network-powered real-time transit optimization",
    href: "/transport",
    color: "from-blue-500 to-cyan-400",
    glowColor: "shadow-blue-500/25",
    stats: "5 routes nearby",
    tech: "AI-Powered"
  },
  {
    icon: Trash2,
    title: "Smart Waste",
    description: "IoT-enabled predictive waste management system",
    href: "/waste",
    color: "from-green-500 to-emerald-400",
    glowColor: "shadow-green-500/25",
    stats: "Next: Tomorrow 7AM",
    tech: "IoT Connected"
  },
  {
    icon: AlertTriangle,
    title: "Instant Reports",
    description: "AR-enhanced infrastructure monitoring with ML analysis",
    href: "/report",
    color: "from-orange-500 to-yellow-400",
    glowColor: "shadow-orange-500/25",
    stats: "3 active reports",
    tech: "AR Enhanced"
  },
  {
    icon: Search,
    title: "Neural Search",
    description: "Quantum-encrypted community lost & found network",
    href: "/lost-found",
    color: "from-purple-500 to-pink-400",
    glowColor: "shadow-purple-500/25",
    stats: "12 active listings",
    tech: "Quantum Secure"
  },
  {
    icon: Calendar,
    title: "Predictive Events",
    description: "Machine learning event discovery and personalization",
    href: "/events",
    color: "from-pink-500 to-rose-400",
    glowColor: "shadow-pink-500/25",
    stats: "4 events this week",
    tech: "ML Curated"
  },
  {
    icon: Phone,
    title: "Emergency AI",
    description: "Instant response system with satellite connectivity",
    href: "/emergency",
    color: "from-red-500 to-orange-400",
    glowColor: "shadow-red-500/25",
    stats: "Always available",
    tech: "Satellite Connected"
  },
  {
    icon: MessageSquare,
    title: "Mesh Network",
    description: "Decentralized community communication protocol",
    href: "/community",
    color: "from-indigo-500 to-blue-400",
    glowColor: "shadow-indigo-500/25",
    stats: "89 active nodes",
    tech: "Mesh Protocol"
  }
];

const advancedStats = [
  { 
    label: "Neural Network Efficiency", 
    value: "99.7%", 
    icon: Brain, 
    trend: "+0.3%",
    description: "AI processing accuracy",
    color: "from-cyan-500 to-blue-500"
  },
  { 
    label: "Quantum Transactions", 
    value: "2.8M", 
    icon: Atom, 
    trend: "+15%",
    description: "Secure data exchanges",
    color: "from-purple-500 to-pink-500"
  },
  { 
    label: "IoT Devices Active", 
    value: "45.2K", 
    icon: Wifi, 
    trend: "+8%",
    description: "Connected city sensors",
    color: "from-green-500 to-emerald-500"
  },
];

const recentActivity = [
  {
    type: "transport",
    message: "AI optimized Route 24 - Reduced wait time by 40%",
    time: "2 min ago",
    icon: Brain,
    color: "text-cyan-400",
    pulse: true
  },
  {
    type: "waste",
    message: "Smart bins detected optimal collection route",
    time: "1 hour ago",
    icon: Cpu,
    color: "text-green-400",
    pulse: false
  },
  {
    type: "event",
    message: "Neural network discovered trending community event",
    time: "3 hours ago",
    icon: Sparkles,
    color: "text-pink-400",
    pulse: false
  }
];

export default function Index() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pb-20 lg:pb-0 relative overflow-hidden">
      {/* Enhanced Multi-layer Background Grid */}
      <div className="absolute inset-0">
        {/* Primary Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        {/* Secondary Micro Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.02)_1px,transparent_1px)] bg-[size:10px_10px] opacity-50" />
        {/* Scanning Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(56,189,248,0.1)_50%,transparent_100%)] bg-[size:200px_100%] animate-pulse" />
      </div>

      {/* Dynamic Mouse Glow */}
      <div
        className="fixed pointer-events-none z-0 w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.4), rgba(147,51,234,0.2), transparent)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              width: Math.random() > 0.7 ? '2px' : '1px',
              height: Math.random() > 0.7 ? '2px' : '1px',
              backgroundColor: ['#38bdf8', '#a855f7', '#ec4899'][Math.floor(Math.random() * 3)],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${3 + Math.random() * 2}s infinite ${Math.random() * 3}s`,
              boxShadow: Math.random() > 0.8 ? '0 0 10px currentColor' : 'none'
            }}
          />
        ))}
      </div>

      {/* Holographic Scan Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-1/4 animate-pulse" />
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent top-2/3 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center">
            {/* Holographic Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                {/* Multiple glow layers for holographic effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-80 transition duration-1000 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl border border-cyan-400/30">
                  <MapPin className="w-12 h-12 text-white filter drop-shadow-lg" />
                  {/* Holographic shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-cyan-400/20 to-transparent rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-purple-400/20 via-transparent to-pink-400/20 rounded-3xl"></div>
                  {/* Scanning line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </div>
              </div>
            </div>

            {/* Holographic Title */}
            <h1 className="text-5xl md:text-8xl font-bold mb-6 relative select-none">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent filter drop-shadow-sm">
                Welcome to
              </span>
              <br />
              <div className="relative inline-block">
                {/* Main text */}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse font-black tracking-wider">
                  CityScape
                </span>
                {/* Glitch effect layers */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent opacity-20 transform translate-x-0.5 translate-y-0.5 font-black tracking-wider">
                  CityScape
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-10 transform -translate-x-0.5 -translate-y-0.5 font-black tracking-wider">
                  CityScape
                </span>
                {/* Holographic scan line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 bg-clip-text text-transparent font-black tracking-wider animate-pulse">
                  CityScape
                </div>
              </div>
              {/* Enhanced floating elements */}
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
              <div className="absolute bottom-0 left-0 transform -translate-x-4 translate-y-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              </div>
              <div className="absolute top-1/2 right-1/4 transform translate-x-8">
                <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </h1>

            <div className="relative mb-4 max-w-4xl mx-auto">
              {/* Terminal-style container */}
              <div className="bg-slate-950/50 border border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center mb-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full opacity-60"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-60"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
                  </div>
                  <div className="ml-4 text-xs text-slate-500 font-mono">$ system_status --platform</div>
                </div>
                <p className="text-xl md:text-2xl text-slate-300 font-mono leading-relaxed">
                  <span className="text-green-400">&gt;</span> Next-generation urban intelligence platform powered by{" "}
                  <span className="text-cyan-400 font-semibold bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">AI</span>,{" "}
                  <span className="text-purple-400 font-semibold bg-purple-400/10 px-2 py-1 rounded border border-purple-400/20">IoT</span>, and{" "}
                  <span className="text-pink-400 font-semibold bg-pink-400/10 px-2 py-1 rounded border border-pink-400/20">Quantum</span> technologies
                  <span className="animate-pulse text-cyan-400 ml-1">_</span>
                </p>
              </div>
            </div>

            {/* Advanced Status Array */}
            <div className="mb-12">
              <div className="bg-slate-950/40 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-3 p-3 bg-green-400/5 border border-green-400/20 rounded-lg">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
                    </div>
                    <span className="text-slate-300 font-mono">NEURAL_NET: </span>
                    <span className="text-green-400 font-bold">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 p-3 bg-blue-400/5 border border-blue-400/20 rounded-lg">
                    <Globe className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-slate-300 font-mono">TIME_SYNC: </span>
                    <span className="text-blue-400 font-bold">{currentTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 p-3 bg-purple-400/5 border border-purple-400/20 rounded-lg">
                    <Shield className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="text-slate-300 font-mono">Q_ENCRYPT: </span>
                    <span className="text-purple-400 font-bold">SECURED</span>
                  </div>
                </div>
                {/* Data stream visualization */}
                <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full animate-pulse" style={{ width: '73%' }}></div>
                </div>
                <div className="text-center mt-2 text-xs text-slate-500 font-mono">SYSTEM_PERFORMANCE: 73.4% | UPTIME: 99.7%</div>
              </div>
            </div>

            {/* Advanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              {advancedStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r opacity-50 rounded-2xl blur group-hover:opacity-75 transition duration-300" 
                         style={{ backgroundImage: `linear-gradient(45deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>
                    <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8 text-cyan-400" />
                        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                          {stat.trend}
                        </span>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                      <div className="text-xs text-slate-500">{stat.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
            Neural-Powered City Services
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg">
            Experience the future of urban living with our quantum-enhanced AI ecosystem
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.href}
                className="group relative"
              >
                <div className={cn(
                  "absolute -inset-0.5 bg-gradient-to-r opacity-50 rounded-2xl blur transition duration-300",
                  `${feature.color} group-hover:opacity-75`
                )}></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group-hover:scale-105">
                  {/* Tech Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full border border-cyan-400/20">
                      {feature.tech}
                    </span>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-2xl flex-shrink-0",
                      feature.color,
                      feature.glowColor
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-white group-hover:text-cyan-400 transition-colors mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-400">
                          {feature.stats}
                        </span>
                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Neural Activity Feed */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Neural Activity Stream</h2>
                <p className="text-slate-400">Real-time AI processing events</p>
              </div>
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Live Processing</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 transition-all">
                    <div className="relative">
                      <Icon className={cn("w-6 h-6", activity.color)} />
                      {activity.pulse && (
                        <div className="absolute inset-0 rounded-full animate-ping">
                          <Icon className={cn("w-6 h-6 opacity-40", activity.color)} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{activity.message}</p>
                    </div>
                    <span className="text-sm text-slate-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <Link
                to="/community"
                className="inline-flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Access Neural Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
