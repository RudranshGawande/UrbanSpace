import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, Search, MessageSquare, ArrowRight, MapPin, Clock, Bus, Train } from "lucide-react";
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
  const [events, setEvents] = useState<ActivityItem[]>([]);
  const [reports, setReports] = useState<ActivityItem[]>([]);
  const [lostFound, setLostFound] = useState<ActivityItem[]>([]);
  const [posts, setPosts] = useState<ActivityItem[]>([]);
  const [transport, setTransport] = useState<{ lastUpdatedISO?: string; routes: any[] }>({ routes: [] });

  useEffect(() => {
    const load = () => {
      const ev = safeParse<EventItem>(localStorage.getItem("cityscape_events"))
        .map<ActivityItem>((e) => ({
          id: e.id,
          type: "event",
          title: e.title,
          desc: e.location || e.description,
          whenISO: e.dateISO,
          href: "/events",
          extras: [e.category],
        }))
        .sort((a, b) => new Date(b.whenISO).getTime() - new Date(a.whenISO).getTime())
        .slice(0, 4);

      const rp = safeParse<ReportItem>(localStorage.getItem("cityscape_reports"))
        .map<ActivityItem>((r) => ({
          id: r.id,
          type: "report",
          title: r.title,
          desc: r.address || r.description,
          whenISO: r.createdAt,
          href: "/report",
          extras: [r.category, r.status],
        }))
        .sort((a, b) => new Date(b.whenISO).getTime() - new Date(a.whenISO).getTime())
        .slice(0, 4);

      const lf = safeParse<LFItem>(localStorage.getItem("cityscape_lostfound"))
        .map<ActivityItem>((i) => ({
          id: i.id,
          type: "lostfound",
          title: `${i.type === "lost" ? "Lost" : "Found"}: ${i.title}`,
          desc: i.location || i.description,
          whenISO: i.dateISO,
          href: "/lost-found",
          extras: [i.category, i.status],
        }))
        .sort((a, b) => new Date(b.whenISO).getTime() - new Date(a.whenISO).getTime())
        .slice(0, 4);

      const ps = safeParse<PostItem>(localStorage.getItem("cityscape_community_posts"))
        .map<ActivityItem>((p) => ({
          id: p.id,
          type: "community",
          title: p.author ? `${p.author} posted` : "New post",
          desc: p.content,
          whenISO: p.createdAt,
          href: "/community",
          extras: [p.topic],
        }))
        .sort((a, b) => new Date(b.whenISO).getTime() - new Date(a.whenISO).getTime())
        .slice(0, 4);

      const snapRaw = localStorage.getItem("cityscape_transport_snapshot");
    let snap: { lastUpdatedISO?: string; routes?: any[] } = {};
    try {
      snap = snapRaw ? JSON.parse(snapRaw) : {};
    } catch {}

    const transportFilter = localStorage.getItem("cityscape_transport_filter") as
      | "all"
      | "bus"
      | "train"
      | null;
    const filteredRoutes = Array.isArray(snap.routes)
      ? snap.routes.filter((r: any) =>
          transportFilter && transportFilter !== "all" ? r.type === transportFilter : true,
        )
      : [];

    setEvents(ev);
    setReports(rp);
    setLostFound(lf);
    setPosts(ps);
    setTransport({
      lastUpdatedISO: snap.lastUpdatedISO,
      routes: filteredRoutes.slice(0, 4),
    });
    };

    load();
    const id = setInterval(load, 2000);
    const onFocus = () => load();
    const onStorage = () => load();
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const nothing = useMemo(() => events.length + reports.length + lostFound.length + posts.length + transport.routes.length === 0, [events, reports, lostFound, posts, transport]);

  const ItemRow = ({ it }: { it: ActivityItem }) => {
    const iconClass = "w-4 h-4";
    const iconBg =
      it.type === "event" ? "bg-pink-100 text-pink-700" :
      it.type === "report" ? "bg-orange-100 text-orange-700" :
      it.type === "lostfound" ? "bg-purple-100 text-purple-700" :
      "bg-indigo-100 text-indigo-700";
    const Icon = it.type === "event" ? Calendar : it.type === "report" ? AlertTriangle : it.type === "lostfound" ? Search : MessageSquare;
    return (
      <Link to={it.href} className="group flex items-start justify-between gap-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
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
            </div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      {nothing ? (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Nothing to show yet. Start by creating content.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Create an event, submit a report, post in community, or check transport.</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transport</CardTitle>
              <CardDescription>Live snapshots from Transport</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {transport.routes.length === 0 ? (
                <div className="text-sm text-muted-foreground">Open Transport to see live routes.</div>
              ) : (
                <div className="space-y-2">
                  {transport.routes.map((r: any) => (
                    <Link key={r.id} to="/transport" className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", r.type === "bus" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>{r.type === "bus" ? <Bus className="w-4 h-4" /> : <Train className="w-4 h-4" />}</div>
                        <div>
                          <div className="font-medium text-foreground">{r.name} ({r.number})</div>
                          <div className="text-xs text-muted-foreground flex gap-2">
                            <span>{r.status}</span>
                            <span>ETA {r.estimatedArrival}</span>
                            {r.delay ? <span>+{r.delay}m</span> : null}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                  {transport.lastUpdatedISO && (
                    <div className="text-[11px] text-muted-foreground">Last updated {timeAgo(transport.lastUpdatedISO)}</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Upcoming and latest events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {events.length === 0 ? (
                <div className="text-sm text-muted-foreground">No events yet.</div>
              ) : (
                events.map((it) => <ItemRow key={`e-${it.id}`} it={it} />)
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Infrastructure issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {reports.length === 0 ? (
                <div className="text-sm text-muted-foreground">No reports yet.</div>
              ) : (
                reports.map((it) => <ItemRow key={`r-${it.id}`} it={it} />)
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Lost & Found</CardTitle>
              <CardDescription>Latest community listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {lostFound.length === 0 ? (
                <div className="text-sm text-muted-foreground">No items yet.</div>
              ) : (
                lostFound.map((it) => <ItemRow key={`l-${it.id}`} it={it} />)
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Community Posts</CardTitle>
              <CardDescription>Newest discussions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {posts.length === 0 ? (
                <div className="text-sm text-muted-foreground">No posts yet.</div>
              ) : (
                posts.map((it) => <ItemRow key={`p-${it.id}`} it={it} />)
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!nothing && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" asChild>
            <Link to="/transport">Transport</Link>
          </Button>
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
    </div>
  );
}
