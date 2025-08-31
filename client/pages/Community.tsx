import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Upload,
  Trash2,
  Heart,
  MessageCircle,
  Search as SearchIcon,
  Filter,
  Image as ImageIcon,
  Pin,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Topic = "General" | "Safety" | "Events" | "Lost & Found" | "Help";

interface PostItem {
  id: string;
  author?: string;
  topic: Topic;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  comments: number;
  pinned?: boolean;
}
type UserState = { likes: Record<string, boolean> };

const TOPICS: Topic[] = ["General", "Safety", "Events", "Lost & Found", "Help"];
const POSTS_KEY = "cityscape_community_posts";
const USER_KEY = "cityscape_community_user";

function readPosts(): PostItem[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as PostItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function writePosts(items: PostItem[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(items));
}
function readUser(): UserState {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return { likes: {} };
    const s = JSON.parse(raw) as UserState;
    return { likes: {}, ...s };
  } catch {
    return { likes: {} };
  }
}
function writeUser(s: UserState) {
  localStorage.setItem(USER_KEY, JSON.stringify(s));
}

interface FormValues {
  author?: string;
  topic: Topic;
  content: string;
}

export default function Community() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostItem[]>(() => readPosts());
  const [user, setUser] = useState<UserState>(() => readUser());
  const [images, setImages] = useState<string[]>([]);
  const [topicFilter, setTopicFilter] = useState<Topic | "all">("all");
  const [tab, setTab] = useState<"new" | "top">("new");
  const [query, setQuery] = useState("");

  const form = useForm<FormValues>({
    defaultValues: { author: "", topic: "General", content: "" },
    mode: "onChange",
  });

  useEffect(() => {
    writePosts(posts);
  }, [posts]);
  useEffect(() => {
    writeUser(user);
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts
      .filter((p) => (topicFilter === "all" ? true : p.topic === topicFilter))
      .filter((p) =>
        q
          ? [p.author || "", p.content, p.topic]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      );
    const sorted = [...list].sort((a, b) =>
      tab === "top"
        ? b.likes - a.likes ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    // Keep pinned posts at the top
    const pinned = sorted.filter((p) => p.pinned);
    const rest = sorted.filter((p) => !p.pinned);
    return [...pinned, ...rest];
  }, [posts, topicFilter, tab, query]);

  const trending = useMemo(() => {
    const map = new Map<Topic, number>();
    for (const t of TOPICS) map.set(t, 0);
    posts.forEach((p) => map.set(p.topic, (map.get(p.topic) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const submit = (values: FormValues) => {
    if (!values.content || values.content.trim().length < 3) {
      toast({
        title: "Post too short",
        description: "Write at least 3 characters.",
      });
      return;
    }
    const item: PostItem = {
      id: crypto.randomUUID(),
      author: values.author?.trim() || "Anonymous",
      topic: values.topic,
      content: values.content.trim(),
      images,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };
    setPosts((prev) => [item, ...prev]);
    setImages([]);
    form.reset({ author: values.author, topic: values.topic, content: "" });
    toast({ title: "Posted", description: "Your message has been shared." });
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).slice(0, 4);
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
      setImages((prev) => [...prev, ...results].slice(0, 4));
    } catch {
      toast({
        title: "Image upload failed",
        description: "Unable to read one or more images.",
      });
    }
  };

  const toggleLike = (id: string) => {
    setUser((prev) => {
      const liked = !!prev.likes[id];
      const next = { ...prev, likes: { ...prev.likes, [id]: !liked } };
      setPosts((ps) =>
        ps.map((p) =>
          p.id === id ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p,
        ),
      );
      return next;
    });
  };

  const removePost = (id: string) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));
  const pinPost = (id: string) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)),
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-indigo-600" /> Community
            </h1>
            <p className="text-muted-foreground">
              Connect with neighbors, share updates, and ask for help.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create a Post</CardTitle>
                <CardDescription>
                  Share an update, ask a question, or post an alert.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select topic" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TOPICS.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <FormLabel>Photos</FormLabel>
                        <div className="grid grid-cols-4 gap-2">
                          <label className="aspect-square border border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                            <Upload className="w-4 h-4 text-muted-foreground mb-1" />
                            <span className="text-[11px] text-muted-foreground">
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
                                alt={`img-${idx}`}
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
                    </div>

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="What's on your mind?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          form.reset({ ...form.getValues(), content: "" });
                          setImages([]);
                        }}
                      >
                        Clear
                      </Button>
                      <Button type="submit">Post</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" /> Feed
                </CardTitle>
                <CardDescription>
                  Sort and filter community posts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select
                    value={topicFilter}
                    onValueChange={(v) => setTopicFilter(v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {TOPICS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <SearchIcon className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                  <TabsList>
                    <TabsTrigger value="new">Newest</TabsTrigger>
                    <TabsTrigger value="top">Top</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="new"
                    className="space-y-3 [&[data-state=inactive]]:hidden"
                  />
                  <TabsContent
                    value="top"
                    className="space-y-3 [&[data-state=inactive]]:hidden"
                  />
                </Tabs>

                <Separator />

                <div className="space-y-3 max-h-[640px] overflow-auto pr-1">
                  {filtered.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      No posts match your filters.
                    </div>
                  )}

                  {filtered.map((p) => (
                    <div
                      key={p.id}
                      className={cn(
                        "border border-border rounded-lg p-3 bg-card/60",
                        p.pinned && "ring-1 ring-indigo-300",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-foreground">
                                {p.author || "Anonymous"}
                              </span>
                              <Badge variant="secondary">{p.topic}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(p.createdAt).toLocaleString()}
                              </span>
                              {p.pinned && (
                                <Badge variant="secondary">Pinned</Badge>
                              )}
                            </div>
                            <div className="mt-1 text-sm whitespace-pre-wrap text-foreground">
                              {p.content}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => pinPost(p.id)}
                            aria-label="Pin"
                          >
                            <Pin
                              className={cn(
                                "w-4 h-4",
                                p.pinned
                                  ? "text-indigo-600"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removePost(p.id)}
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {p.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {p.images.slice(0, 4).map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt={`post-${i}`}
                              className="w-full aspect-square object-cover rounded"
                            />
                          ))}
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <button
                          onClick={() => toggleLike(p.id)}
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Heart
                            className={cn(
                              "w-4 h-4",
                              user.likes[p.id]
                                ? "fill-current text-red-600"
                                : "",
                            )}
                          />{" "}
                          {p.likes}
                        </button>
                        <div className="inline-flex items-center gap-1 text-muted-foreground">
                          <MessageCircle className="w-4 h-4" /> {p.comments}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>Most active categories.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {trending.map(([t, count]) => (
                  <div
                    key={t}
                    className="flex items-center justify-between border rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>{t}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
