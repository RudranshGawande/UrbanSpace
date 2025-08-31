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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  MapPin,
  Upload,
  Image as ImageIcon,
  Trash2,
  LocateFixed,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ReportStatus = "submitted" | "in-progress" | "resolved";

type ReportCategory =
  | "Road Damage"
  | "Streetlight Outage"
  | "Garbage Overflow"
  | "Water Leakage"
  | "Power Outage"
  | "Other";

interface ReportContact {
  allowContact: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

interface Coords {
  lat: number;
  lng: number;
}

interface ReportItem {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  address?: string;
  coords?: Coords;
  photos: string[];
  status: ReportStatus;
  createdAt: string;
  contact?: ReportContact;
}

interface FormValues {
  title: string;
  category: ReportCategory;
  description: string;
  address?: string;
  allowContact: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

const CATEGORIES: ReportCategory[] = [
  "Road Damage",
  "Streetlight Outage",
  "Garbage Overflow",
  "Water Leakage",
  "Power Outage",
  "Other",
];

const LOCAL_KEY = "cityscape_reports";

function readReports(): ReportItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ReportItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReports(items: ReportItem[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function statusBadgeClass(status: ReportStatus) {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "in-progress":
      return "bg-orange-100 text-orange-700 hover:bg-orange-100";
    case "resolved":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    default:
      return "bg-muted text-foreground";
  }
}

export default function Report() {
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportItem[]>(() => readReports());
  const [coords, setCoords] = useState<Coords | undefined>(undefined);
  const [locating, setLocating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | "all">(
    "all",
  );

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: "Road Damage",
      description: "",
      address: "",
      allowContact: false,
      name: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  const filteredReports = useMemo(() => {
    return reports.filter(
      (r) =>
        (statusFilter === "all" || r.status === statusFilter) &&
        (categoryFilter === "all" || r.category === categoryFilter),
    );
  }, [reports, statusFilter, categoryFilter]);

  useEffect(() => {
    writeReports(reports);
  }, [reports]);

  const onSubmit = (values: FormValues) => {
    if (!values.title || values.title.trim().length < 5) {
      toast({
        title: "Title too short",
        description: "Please provide a descriptive title (min 5 characters).",
      });
      return;
    }
    if (!values.description || values.description.trim().length < 15) {
      toast({
        title: "Description too short",
        description: "Please describe the issue with at least 15 characters.",
      });
      return;
    }
    if (values.allowContact) {
      const hasEmailOrPhone =
        Boolean(values.email?.trim()) || Boolean(values.phone?.trim());
      if (!hasEmailOrPhone) {
        toast({
          title: "Contact required",
          description: "Provide an email or phone if you allow contact.",
        });
        return;
      }
    }

    const item: ReportItem = {
      id: crypto.randomUUID(),
      title: values.title.trim(),
      category: values.category,
      description: values.description.trim(),
      address: values.address?.trim() || undefined,
      coords,
      photos: images,
      status: "submitted",
      createdAt: new Date().toISOString(),
      contact: values.allowContact
        ? {
            allowContact: true,
            name: values.name?.trim() || undefined,
            email: values.email?.trim() || undefined,
            phone: values.phone?.trim() || undefined,
          }
        : { allowContact: false },
    };

    setReports((prev) => [item, ...prev]);
    form.reset({
      title: "",
      category: "Road Damage",
      description: "",
      address: "",
      allowContact: false,
      name: "",
      email: "",
      phone: "",
    });
    setImages([]);

    toast({
      title: "Report submitted",
      description: "Thank you for helping improve city infrastructure.",
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

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not available",
        description: "Your browser does not support location access.",
      });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast({
          title: "Location captured",
          description: "Coordinates added to the report.",
        });
      },
      () => {
        setLocating(false);
        toast({
          title: "Location denied",
          description: "Allow location permission or enter an address.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const updateStatus = (id: string, status: ReportStatus) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const removeReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-7 h-7 text-orange-500" /> Report Issue
            </h1>
            <p className="text-muted-foreground">
              Submit infrastructure problems with photos and location. We'll
              keep you updated.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>New Report</CardTitle>
              <CardDescription>
                Provide details to help the city resolve the issue quickly.
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
                              placeholder="e.g. Large pothole near City Hall"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Make it concise and descriptive.
                          </FormDescription>
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
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map((c) => (
                                <SelectItem value={c} key={c}>
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
                            rows={5}
                            placeholder="Describe the issue, severity, and exact spot."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address or Landmark</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 123 Main St, near fountain"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Coordinates
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={useMyLocation}
                          disabled={locating}
                        >
                          <LocateFixed
                            className={cn(
                              "w-4 h-4 mr-2",
                              locating && "animate-pulse",
                            )}
                          />
                          {locating ? "Locating..." : "Use my location"}
                        </Button>
                      </div>
                      <div className="text-sm">
                        {coords ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              lat {coords.lat.toFixed(6)}
                            </Badge>
                            <Badge variant="secondary">
                              lng {coords.lng.toFixed(6)}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No coordinates captured
                          </span>
                        )}
                      </div>
                    </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="allowContact"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Allow city to contact you</FormLabel>
                            <FormDescription>
                              Share your info for follow-ups and status updates.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.watch("allowContact") && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="1234567890"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        form.reset();
                        setImages([]);
                        setCoords(undefined);
                      }}
                    >
                      Reset
                    </Button>
                    <Button type="submit">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Submit Report
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  View and manage your submitted reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <SelectItem value={c} key={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
                  {filteredReports.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      No reports match the selected filters.
                    </div>
                  )}
                  {filteredReports.map((r) => (
                    <div
                      key={r.id}
                      className="border border-border rounded-lg p-3 bg-card/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {r.title}
                            </span>
                            <Badge variant="secondary">{r.category}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDateTime(r.createdAt)}
                          </div>
                        </div>
                        <Badge className={statusBadgeClass(r.status)}>
                          {r.status}
                        </Badge>
                      </div>

                      {r.address && (
                        <div className="text-sm mt-2">
                          <span className="text-muted-foreground">
                            Address:
                          </span>{" "}
                          {r.address}
                        </div>
                      )}
                      {r.coords && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Coords:</span>{" "}
                          {r.coords.lat.toFixed(5)}, {r.coords.lng.toFixed(5)}
                        </div>
                      )}

                      {r.photos.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {r.photos.slice(0, 4).map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt={`report-${i}`}
                              className="w-full aspect-square object-cover rounded"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm line-clamp-2 text-muted-foreground pr-4">
                          {r.description}
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            onValueChange={(v) =>
                              updateStatus(r.id, v as ReportStatus)
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">
                                Submitted
                              </SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeReport(r.id)}
                            aria-label="Delete report"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Accurate Reports</CardTitle>
                <CardDescription>
                  Improve response time with clear details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ImageIcon className="w-4 h-4 mt-0.5" />
                  Upload clear, close-up photos. Include a wide shot for
                  context.
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  Provide a precise address or capture GPS coordinates.
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  Mention hazards if any (exposed wires, deep potholes, etc.).
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Personal data is stored locally in your browser.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
