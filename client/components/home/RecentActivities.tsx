import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, Search, MessageSquare, ArrowRight, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  dateISO: string;
  endISO?: string;
  photos: string[];
  status: string;
  attendees: number;
}
interface ReportItem {
  id: string;
  title: string;
  category: string;
  description: string;
  address?: string;
  createdAt: string;
  status: string;
}
interface LFItem {
  id: string;
  type: "lost" | "found";
  title: string;
  description: string;
  category: string;
  location?: string;
  dateISO: string;
  status: string;
}
interface PostItem {
  id: string;
  author?: string;
  topic: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
}

type ActivityType = "event" | "report" | "lostfound" | "community";
interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  desc?: string;
  whenISO: string;
  href: string;
  extras?: string[];
}

function safeParse<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function RecentActivities() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const events = safeParse<EventItem>(localStorage.getItem("cityscape_events"))
      .map<ActivityItem>((e) => ({
        id: e.id,
        type: "event",
        title: e.title,
        desc: e.location || e.description,
        whenISO: e.dateISO,
        href: "/events",
        extras: [e.category],
      }));

    const reports = safeParse<ReportItem>(localStorage.getItem("cityscape_reports"))
      .map<ActivityItem>((r) => ({
        id: r.id,
        type: "report",
        title: r.title,
        desc: r.address || r.description,
        whenISO: r.createdAt,
        href: "/report",
        extras: [r.category, r.status],
      }));

    const lostfound = safeParse<LFItem>(localStorage.getItem("cityscape_lostfound"))
      .map<ActivityItem>((i) => ({
        id: i.id,
        type: "lostfound",
        title: `${i.type === "lost" ? "Lost" : "Found"}: ${i.title}`,
        desc: i.location || i.description,
        whenISO: i.dateISO,
        href: "/lost-found",
        extras: [i.category, i.status],
      }));

    const posts = safeParse<PostItem>(localStorage.getItem("cityscape_community_posts"))
      .map<ActivityItem>((p) => ({
        id: p.id,
        type: "community",
        title: p.author ? `${p.author} posted` : "New post",
        desc: p.content,
        whenISO: p.createdAt,
        href: "/community",
        extras: [p.topic],
      }));

    const merged = [...events, ...reports, ...lostfound, ...posts]
      .filter((i) => !!i.whenISO)
      .sort((a, b) => new Date(b.whenISO).getTime() - new Date(a.whenISO).getTime())
      .slice(0, 8);

    setItems(merged);
  }, []);

  const empty = useMemo(() => items.length === 0, [items]);

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Recent Activities</span>
        </CardTitle>
        <CardDescription>Latest events, reports, posts, and lost & found.</CardDescription>
      </CardHeader>
      <CardContent>
        {empty ? (
          <div className="text-sm text-muted-foreground">No recent activity yet. Create an event, submit a report, or post in the community.</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => {
              const iconClass = "w-4 h-4";
              const iconBg =
                it.type === "event" ? "bg-pink-100 text-pink-700" :
                it.type === "report" ? "bg-orange-100 text-orange-700" :
                it.type === "lostfound" ? "bg-purple-100 text-purple-700" :
                "bg-indigo-100 text-indigo-700";
              const Icon = it.type === "event" ? Calendar : it.type === "report" ? AlertTriangle : it.type === "lostfound" ? Search : MessageSquare;
              return (
                <Link
                  key={`${it.type}-${it.id}`}
                  to={it.href}
                  className="group flex items-start justify-between gap-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
                      <Icon className={iconClass} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{it.title}</span>
                        {it.extras?.map((x, idx) => (
                          <Badge key={idx} variant="secondary">{x}</Badge>
                        ))}
                      </div>
                      {it.desc && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{it.desc}</div>
                      )}
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="w-3.5 h-3.5" /> {timeAgo(it.whenISO)}
                        {it.type === "event" && (
                          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Event</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        )}
        {!empty && (
          <div className="flex items-center justify-end mt-4 gap-2">
            <Button variant="secondary" asChild>
              <Link to="/events">Events</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/report">Reports</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/lost-found">Lost & Found</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/community">Community</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
