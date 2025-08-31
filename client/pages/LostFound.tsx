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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload, Trash2, MapPin, CheckCircle2, PawPrint, FileText, Shirt, Smartphone, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type ItemType = "lost" | "found";

type Category =
  | "Electronics"
  | "Accessories"
  | "Documents"
  | "Pet"
  | "Clothing"
  | "Other";

type ItemStatus = "open" | "claimed" | "returned";

interface Coords { lat: number; lng: number }

interface ContactInfo {
  allowContact: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

interface LFItem {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: Category;
  location?: string;
  coords?: Coords;
  dateISO: string;
  photos: string[];
  status: ItemStatus;
  contact?: ContactInfo;
}

interface FormValues {
  type: ItemType;
  title: string;
  description: string;
  category: Category;
  location?: string;
  allowContact: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

const CATEGORIES: Category[] = [
  "Electronics",
  "Accessories",
  "Documents",
  "Pet",
  "Clothing",
  "Other",
];

const LOCAL_KEY = "cityscape_lostfound";

function readItems(): LFItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LFItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeItems(items: LFItem[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

function statusBadgeClass(status: ItemStatus) {
  switch (status) {
    case "open":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "claimed":
      return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100";
    case "returned":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    default:
      return "bg-muted text-foreground";
  }
}

function categoryIcon(cat: Category) {
  switch (cat) {
    case "Electronics":
      return Smartphone;
    case "Accessories":
      return PackageOpen;
    case "Documents":
      return FileText;
    case "Pet":
      return PawPrint;
    case "Clothing":
      return Shirt;
    default:
      return PackageOpen;
  }
}

export default function LostFound() {
  const { toast } = useToast();
  const [items, setItems] = useState<LFItem[]>(() => readItems());
  const [images, setImages] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<ItemType>("lost");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("all");

  const form = useForm<FormValues>({
    defaultValues: {
      type: "lost",
      title: "",
      description: "",
      category: "Electronics",
      location: "",
      allowContact: false,
      name: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    writeItems(items);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => i.type === activeType)
      .filter((i) => (categoryFilter === "all" ? true : i.category === categoryFilter))
      .filter((i) => (statusFilter === "all" ? true : i.status === statusFilter))
      .filter((i) =>
        q
          ? [i.title, i.description, i.location || "", i.category]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
  }, [items, activeType, categoryFilter, statusFilter, query]);

  const onSubmit = (values: FormValues) => {
    if (!values.title || values.title.trim().length < 3) {
      toast({ title: "Title too short", description: "Provide a descriptive title (min 3 chars)." });
      return;
    }
    if (!values.description || values.description.trim().length < 10) {
      toast({ title: "Description too short", description: "Add at least 10 characters." });
      return;
    }

    const item: LFItem = {
      id: crypto.randomUUID(),
      type: values.type,
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      location: values.location?.trim() || undefined,
      dateISO: new Date().toISOString(),
      photos: images,
      status: "open",
      contact: values.allowContact
        ? {
            allowContact: true,
            name: values.name?.trim() || undefined,
            email: values.email?.trim() || undefined,
            phone: values.phone?.trim() || undefined,
          }
        : { allowContact: false },
    };

    setItems((prev) => [item, ...prev]);
    setImages([]);
    form.reset({
      type: activeType,
      title: "",
      description: "",
      category: "Electronics",
      location: "",
      allowContact: false,
      name: "",
      email: "",
      phone: "",
    });

    toast({ title: `${values.type === "lost" ? "Lost" : "Found"} item posted`, description: "Thanks for contributing!" });
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
        })
    );
    try {
      const results = await Promise.all(readers);
      setImages((prev) => [...prev, ...results].slice(0, 5));
    } catch {
      toast({ title: "Image upload failed", description: "Unable to read one or more images." });
    }
  };

  const markStatus = (id: string, status: ItemStatus) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Search className="w-7 h-7 text-purple-600" /> Lost & Found
            </h1>
            <p className="text-muted-foreground">Post lost or found items and connect with your community.</p>
          </div>
        </div>

        <Tabs value={activeType} onValueChange={(v) => { setActiveType(v as ItemType); form.setValue("type", v as ItemType); }}>
          <TabsList className="mb-6">
            <TabsTrigger value="lost">Lost Items</TabsTrigger>
            <TabsTrigger value="found">Found Items</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TabsContent value="lost" className="lg:col-span-2 [&[data-state=inactive]]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Post a Lost Item</CardTitle>
                  <CardDescription>Provide details to help others identify and return your item.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <input type="hidden" {...form.register("type")} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Black wallet with initials RG" {...field} />
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
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
                              <Textarea rows={5} placeholder="Describe the item, distinctive marks, when and where it was lost." {...field} />
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
                            <FormLabel>Last Known Location</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Near North Gate, IETK campus" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel>Photos</FormLabel>
                          <div className="text-xs text-muted-foreground">Up to 5 images</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <label className="aspect-square border border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                            <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground">Upload</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                          </label>
                          {images.map((src, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                              <img src={src} alt={`uploaded-${idx}`} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow" aria-label="Remove image">
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
                                <FormLabel>Allow contact</FormLabel>
                                <FormDescription>Share your info so finders can reach you.</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {form.watch("allowContact") && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl><Input type="tel" placeholder="1234567890" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => { form.reset({ ...form.getValues(), title: "", description: "", location: "" }); setImages([]); }}>
                          Reset
                        </Button>
                        <Button type="submit"><CheckCircle2 className="w-4 h-4 mr-2" /> Post</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="found" className="lg:col-span-2 [&[data-state=inactive]]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Post a Found Item</CardTitle>
                  <CardDescription>Help reunite items with their owners by sharing details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <input type="hidden" {...form.register("type")} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Title</FormLabel>
                            <FormControl><Input placeholder="e.g. Silver ring with blue stone" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl><Textarea rows={5} placeholder="Describe the item and where you found it." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Found At</FormLabel>
                          <FormControl><Input placeholder="e.g. Library front desk" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel>Photos</FormLabel>
                          <div className="text-xs text-muted-foreground">Up to 5 images</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <label className="aspect-square border border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                            <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground">Upload</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                          </label>
                          {images.map((src, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                              <img src={src} alt={`uploaded-${idx}`} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow" aria-label="Remove image">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="allowContact" render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Allow contact</FormLabel>
                              <FormDescription>Share your info so owners can reach you.</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )} />
                        {form.watch("allowContact") && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                              <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="1234567890" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => { form.reset({ ...form.getValues(), title: "", description: "", location: "" }); setImages([]); }}>
                          Reset
                        </Button>
                        <Button type="submit"><CheckCircle2 className="w-4 h-4 mr-2" /> Post</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Browse</CardTitle>
                  <CardDescription>Search and filter items.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search title, description, location..." value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map((c) => (<SelectItem value={c} key={c}>{c}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="claimed">Claimed</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Results</span>
                    <Badge variant="secondary">{filtered.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[520px] overflow-auto pr-1">
                  {filtered.length === 0 && (
                    <div className="text-sm text-muted-foreground">No items match your filters.</div>
                  )}

                  {filtered.map((it) => {
                    const Icon = categoryIcon(it.category);
                    return (
                      <div key={it.id} className="border border-border rounded-lg p-3 bg-card/60">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-foreground">{it.title}</span>
                                <Badge variant="secondary">{it.category}</Badge>
                                <Badge className={statusBadgeClass(it.status)}>{it.status}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(it.dateISO).toLocaleString()} {it.location ? `• ${it.location}` : ""}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select onValueChange={(v) => markStatus(it.id, v as ItemStatus)}>
                              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Change status" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="claimed">Claimed</SelectItem>
                                <SelectItem value="returned">Returned</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(it.id)} aria-label="Delete item">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        {it.photos.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {it.photos.slice(0, 4).map((src, i) => (
                              <img key={i} src={src} alt={`lf-${i}`} className="w-full aspect-square object-cover rounded" />
                            ))}
                          </div>
                        )}

                        <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{it.description}</div>

                        {it.contact?.allowContact && (it.contact.email || it.contact.phone) && (
                          <div className="mt-2 text-sm">
                            <Separator className="my-2" />
                            <div className="text-muted-foreground">Contact</div>
                            <div className="flex flex-wrap gap-3 text-sm">
                              {it.contact.name && <Badge variant="secondary">{it.contact.name}</Badge>}
                              {it.contact.email && <Badge variant="secondary">{it.contact.email}</Badge>}
                              {it.contact.phone && <Badge variant="secondary">{it.contact.phone}</Badge>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
