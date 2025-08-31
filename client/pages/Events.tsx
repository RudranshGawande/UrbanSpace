import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar as CalendarIcon,
  Upload,
  Trash2,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";

type Category =
  | "Community"
  | "Academic"
  | "Sports"
  | "Cultural"
  | "Workshop"
  | "Other";

type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface EventItem {
  id: string;
  title: string;
  category: Category;
  description: string;
  location: string;
  dateISO: string; // start datetime
  endISO?: string; // optional end datetime
  photos: string[];
  status: EventStatus;
  attendees: number;
}

interface FormValues {
  title: string;
  category: Category;
  description: string;
  location: string;
  date: Date | undefined;
  time: string; // HH:mm
  endTime?: string; // HH:mm
}

const CATEGORIES: Category[] = [
  "Community",
  "Academic",
  "Sports",
  "Cultural",
  "Workshop",
  "Other",
];

const LOCAL_KEY = "cityscape_events";
const LOCAL_STATUS_KEY = "cityscape_events_user_status";

function readEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as EventItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function writeEvents(items: EventItem[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}
type UserStatusMap = Record<string, { going: boolean }>;
function readUserStatus(): UserStatusMap {
  try {
    const raw = localStorage.getItem(LOCAL_STATUS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UserStatusMap;
  } catch {
    return {};
  }
}
function writeUserStatus(map: UserStatusMap) {
  localStorage.setItem(LOCAL_STATUS_KEY, JSON.stringify(map));
}

function toISO(date: Date, time: string) {
  const [hh, mm] = time.split(":");
  const d = new Date(date);
  d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
  return d.toISOString();
}
function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now();
}
function isOngoing(startISO: string, endISO?: string) {
  const now = Date.now();
  const start = new Date(startISO).getTime();
  const end = endISO ? new Date(endISO).getTime() : start + 2 * 60 * 60 * 1000; // default 2h
  return start <= now && now <= end;
}
function computeStatus(e: EventItem): EventStatus {
  if (e.status === "cancelled") return "cancelled";
  if (isOngoing(e.dateISO, e.endISO)) return "ongoing";
  if (isPast(e.dateISO)) return "completed";
  return "upcoming";
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function Events() {
  const { toast } = useToast();
  const [events, setEvents] = useState<EventItem[]>(() => readEvents());
  const [userStatus, setUserStatus] = useState<UserStatusMap>(() =>
    readUserStatus(),
  );
  const [images, setImages] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [tab, setTab] = useState<"upcoming" | "past" | "all">("upcoming");

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: "Community",
      description: "",
      location: "",
      date: undefined,
      time: "10:00",
      endTime: "12:00",
    },
    mode: "onChange",
  });

  useEffect(() => {
    writeEvents(events);
  }, [events]);
  useEffect(() => {
    writeUserStatus(userStatus);
  }, [userStatus]);

  const filtered = useMemo(() => {
    const list = events
      .map((e) => ({ ...e, status: computeStatus(e) }))
      .filter((e) =>
        categoryFilter === "all" ? true : e.category === categoryFilter,
      )
      .filter((e) =>
        selectedDate
          ? new Date(e.dateISO).toDateString() === selectedDate.toDateString()
          : true,
      )
      .filter((e) => {
        if (tab === "all") return true;
        if (tab === "upcoming")
          return e.status === "upcoming" || e.status === "ongoing";
        return e.status === "completed";
      })
      .filter((e) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [e.title, e.description, e.location, e.category]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort(
        (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime(),
      );
    return tab === "past" ? list.reverse() : list;
  }, [events, categoryFilter, selectedDate, tab, query]);

  const eventDateSet = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      const d = new Date(e.dateISO);
      set.add(startOfDay(d).toDateString());
    });
    return set;
  }, [events]);
  const hasEventMatcher = (day: Date) =>
    eventDateSet.has(startOfDay(day).toDateString());

  const onSubmit = (values: FormValues) => {
    if (!values.title || values.title.trim().length < 3) {
      toast({
        title: "Title too short",
        description: "Add a descriptive title (min 3 chars).",
      });
      return;
    }
    if (!values.description || values.description.trim().length < 10) {
      toast({
        title: "Description too short",
        description: "Add at least 10 characters.",
      });
      return;
    }
    if (!values.location || values.location.trim().length < 2) {
      toast({
        title: "Location required",
        description: "Provide a clear location or venue.",
      });
      return;
    }
    if (!values.date) {
      toast({
        title: "Date required",
        description: "Pick a date from the calendar.",
      });
      return;
    }

    const startISO = toISO(values.date, values.time || "00:00");
    const endISO = values.endTime
      ? toISO(values.date, values.endTime)
      : undefined;

    const item: EventItem = {
      id: crypto.randomUUID(),
      title: values.title.trim(),
      category: values.category,
      description: values.description.trim(),
      location: values.location.trim(),
      dateISO: startISO,
      endISO,
      photos: images,
      status: "upcoming",
      attendees: 0,
    };

    setEvents((prev) => {
      const next = [...prev, item].sort(
        (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime(),
      );
      return next;
    });
    setImages([]);
    form.reset({
      title: "",
      category: values.category,
      description: "",
      location: "",
      date: values.date,
      time: values.time,
      endTime: values.endTime,
    });
    toast({
      title: "Event created",
      description: "Your event has been added to the calendar.",
    });
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).slice(0, 5);
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    );
    try {
      const results = await Promise.all(readers);
      setImages((prev) => [...prev, ...results].slice(0, 5));
    } catch {
      toast({
        title: "Image upload failed",
        description: "Unable to read one or more images.",
      });
    }
  };

  const toggleGoing = (id: string) => {
    setUserStatus((prev) => {
      const current = prev[id]?.going ?? false;
      const nextMap = { ...prev, [id]: { going: !current } };
      setEvents((evs) =>
        evs.map((e) =>
          e.id === id
            ? { ...e, attendees: e.attendees + (!current ? 1 : -1) }
            : e,
        ),
      );
      return nextMap;
    });
  };

  const cancelEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "cancelled" } : e)),
    );
  };
  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setUserStatus((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-pink-600" /> Events
            </h1>
            <p className="text-muted-foreground">
              Discover and organize events around your community.
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Event</CardTitle>
                  <CardDescription>
                    Share details to get people involved.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Neighborhood Cleanup Drive"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>
                                      {c}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                placeholder="What is this about, agenda, who should join, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. IETK Main Auditorium"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange as any}
                                className="rounded-md border"
                                modifiers={{ hasEvent: hasEventMatcher }}
                                modifiersClassNames={{
                                  hasEvent: "ring-2 ring-primary/60 rounded-md",
                                }}
                              />
                              <FormDescription>
                                Select the event date.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel>Photos</FormLabel>
                          <div className="text-xs text-muted-foreground">
                            Up to 5 images
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <label className="aspect-square border border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                            <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground">
                              Upload
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => handleFiles(e.target.files)}
                            />
                          </label>
                          {images.map((src, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-lg overflow-hidden border border-border"
                            >
                              <img
                                src={src}
                                alt={`uploaded-${idx}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setImages((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  )
                                }
                                className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow"
                                aria-label="Remove image"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            form.reset({
                              ...form.getValues(),
                              title: "",
                              description: "",
                              location: "",
                            });
                            setImages([]);
                          }}
                        >
                          Reset
                        </Button>
                        <Button type="submit">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Create
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" /> Browse Events
                  </CardTitle>
                  <CardDescription>
                    Filter by date, category, and keywords.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate as any}
                        className="rounded-md border"
                        modifiers={{ hasEvent: hasEventMatcher }}
                        modifiersClassNames={{
                          hasEvent: "ring-2 ring-primary/60 rounded-md",
                        }}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedDate(new Date())}
                        >
                          Today
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedDate(undefined)}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Select
                          value={categoryFilter}
                          onValueChange={(v) => setCategoryFilter(v as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Search title, location, description"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                        {filtered.length === 0 && (
                          <div className="text-sm text-muted-foreground">
                            No events match your filters.
                          </div>
                        )}

                        {filtered.map((e) => (
                          <div
                            key={e.id}
                            className={cn(
                              "border rounded-lg p-4",
                              e.status === "cancelled"
                                ? "bg-red-50 border-red-200"
                                : "border-border bg-card/60",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-foreground">
                                    {e.title}
                                  </span>
                                  <Badge variant="secondary">
                                    {e.category}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {new Date(e.dateISO).toLocaleString()}
                                  </Badge>
                                  {e.status !== "upcoming" && (
                                    <Badge variant="secondary">
                                      {e.status}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                  <MapPin className="w-4 h-4" /> {e.location}
                                  <Clock className="w-4 h-4 ml-3" />{" "}
                                  {new Date(e.dateISO).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    <Users className="w-3 h-3" /> {e.attendees}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant={
                                      userStatus[e.id]?.going
                                        ? "default"
                                        : "secondary"
                                    }
                                    onClick={() => toggleGoing(e.id)}
                                  >
                                    {userStatus[e.id]?.going
                                      ? "Going"
                                      : "I'm going"}
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => cancelEvent(e.id)}
                                    aria-label="Cancel event"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {e.photos.length > 0 && (
                              <div className="grid grid-cols-4 gap-2 mt-3">
                                {e.photos.slice(0, 4).map((src, i) => (
                                  <img
                                    key={i}
                                    src={src}
                                    alt={`event-${i}`}
                                    className="w-full aspect-square object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}

                            <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                              {e.description}
                            </div>

                            {e.status === "cancelled" && (
                              <div className="mt-2 text-sm text-red-600">
                                This event has been cancelled.
                              </div>
                            )}

                            <div className="mt-2 text-xs text-muted-foreground">
                              ID: {e.id}
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeEvent(e.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tips for Better Events</CardTitle>
                  <CardDescription>
                    Help attendees plan and participate.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div>Include start/end times and exact location details.</div>
                  <div>
                    Mention requirements (registration, fees, items to bring).
                  </div>
                  <div>Upload a clear poster or relevant images.</div>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Event data is stored in your browser.
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
