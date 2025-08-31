import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Phone, MapPin, LocateFixed, MessageSquare, Plus, Trash2, ShieldAlert, Send, Settings, Ambulance, Hospital, PoliceCar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Coords { lat: number; lng: number }
interface Contact { id: string; name: string; phone: string; relation: string; primary?: boolean }
interface SettingsData { defaultAction: "call" | "sms"; includeLocationInSMS: boolean; primaryContactId?: string }

const CONTACTS_KEY = "cityscape_emergency_contacts";
const SETTINGS_KEY = "cityscape_emergency_settings";

function readContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Contact[];
    return Array.isArray(arr) ? arr : [];
  } catch { return [] }
}
function writeContacts(items: Contact[]) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(items));
}
function readSettings(): SettingsData {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { defaultAction: "call", includeLocationInSMS: true };
    const s = JSON.parse(raw) as SettingsData;
    return { defaultAction: "call", includeLocationInSMS: true, ...s };
  } catch { return { defaultAction: "call", includeLocationInSMS: true } }
}
function writeSettings(s: SettingsData) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function formatCoords(coords?: Coords) {
  if (!coords) return "";
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
}

export default function Emergency() {
  const { toast } = useToast();
  const [coords, setCoords] = useState<Coords | undefined>(undefined);
  const [locating, setLocating] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(() => readContacts());
  const [settings, setSettings] = useState<SettingsData>(() => readSettings());

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelation, setNewRelation] = useState("Family");

  useEffect(() => { writeContacts(contacts); }, [contacts]);
  useEffect(() => { writeSettings(settings); }, [settings]);

  const primary = useMemo(() => contacts.find(c => c.id === settings.primaryContactId) || contacts.find(c => c.primary) || contacts[0], [contacts, settings.primaryContactId]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not available", description: "Your browser does not support location access." });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast({ title: "Location captured", description: "Coordinates are ready to share." });
      },
      () => {
        setLocating(false);
        toast({ title: "Location denied", description: "Allow location permission to attach your location." });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const smsText = () => {
    const base = "I need help. Please contact me ASAP.";
    if (settings.includeLocationInSMS && coords) {
      const gmaps = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
      return `${base} My location: ${gmaps}`;
    }
    return base;
  };

  const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;
  const smsHref = (phone: string) => {
    const text = encodeURIComponent(smsText());
    return `sms:${phone.replace(/[^+\d]/g, "")}?&body=${text}`;
  };

  const handleSOS = () => {
    if (!primary) {
      toast({ title: "No contacts set", description: "Add an emergency contact first." });
      return;
    }
    const action = settings.defaultAction;
    const link = action === "call" ? telHref(primary.phone) : smsHref(primary.phone);
    window.location.href = link;
  };

  const addContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast({ title: "Missing details", description: "Name and phone are required." });
      return;
    }
    const item: Contact = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      phone: newPhone.trim(),
      relation: newRelation,
    };
    setContacts(prev => [item, ...prev]);
    if (!settings.primaryContactId) setSettings(s => ({ ...s, primaryContactId: item.id }));
    setNewName(""); setNewPhone("");
    toast({ title: "Contact added", description: `${item.name} saved.` });
  };
  const removeContact = (id: string) => setContacts(prev => prev.filter(c => c.id !== id));

  const setPrimary = (id: string) => setSettings(s => ({ ...s, primaryContactId: id }));

  const mapsSearchUrl = (q: string) => {
    if (coords) return `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${coords.lat},${coords.lng},15z`;
    return `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
  };

  const quickServices = [
    { label: "Ambulance", icon: Ambulance, query: "ambulance" },
    { label: "Hospital", icon: Hospital, query: "hospital" },
    { label: "Police", icon: PoliceCar, query: "police" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-red-600" /> Emergency
            </h1>
            <p className="text-muted-foreground">Quick access to SOS, contacts, and nearby services.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">Immediate Assistance</CardTitle>
                <CardDescription>Trigger a call or SMS to your primary emergency contact.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="secondary" className="flex items-center gap-1"><Settings className="w-3 h-3" /> Default: {settings.defaultAction.toUpperCase()}</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Include location in SMS: {settings.includeLocationInSMS ? "Yes" : "No"}</Badge>
                      {primary && <Badge variant="secondary">Primary: {primary.name}</Badge>}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <Select value={settings.defaultAction} onValueChange={(v) => setSettings(s => ({ ...s, defaultAction: v as any }))}>
                        <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2 border rounded-lg p-2">
                        <Switch checked={settings.includeLocationInSMS} onCheckedChange={(v) => setSettings(s => ({ ...s, includeLocationInSMS: v }))} />
                        <span className="text-sm text-muted-foreground">Include location in SMS</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="lg" className="h-16 w-full md:w-40 text-lg bg-red-600 hover:bg-red-700">
                          <Send className="w-5 h-5 mr-2" /> SOS
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm SOS</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will {settings.defaultAction === "call" ? "start a phone call" : "open your SMS app"} to your primary contact{primary ? ` (${primary.name})` : ""}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSOS}>Proceed</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {coords ? formatCoords(coords) : "No coordinates"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={useMyLocation} disabled={locating}>
                      <LocateFixed className={cn("w-4 h-4 mr-2", locating && "animate-pulse")} />
                      {locating ? "Locating..." : "Use my location"}
                    </Button>
                    <a
                      href={coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : "https://maps.google.com"}
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center text-sm px-3 py-2 rounded-md border hover:bg-muted"
                    >
                      Open in Maps
                    </a>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>Add trusted people you can contact quickly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <Input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                  <Input placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                  <Select value={newRelation} onValueChange={setNewRelation}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Colleague">Colleague</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addContact} className="md:col-span-2"><Plus className="w-4 h-4 mr-2" /> Add Contact</Button>
                </div>

                <Separator />

                <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                  {contacts.length === 0 && (
                    <div className="text-sm text-muted-foreground">No contacts yet. Add a contact above.</div>
                  )}
                  {contacts.map((c) => (
                    <div key={c.id} className="border border-border rounded-lg p-3 bg-card/60">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-foreground">{c.name}</span>
                            <Badge variant="secondary">{c.relation}</Badge>
                            {settings.primaryContactId === c.id && <Badge variant="secondary">Primary</Badge>}
                          </div>
                          <div className="text-xs text-muted-foreground">{c.phone}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={telHref(c.phone)} className="inline-flex items-center px-3 py-2 rounded-md border hover:bg-muted text-sm"><Phone className="w-4 h-4 mr-1" /> Call</a>
                          <a href={smsHref(c.phone)} className="inline-flex items-center px-3 py-2 rounded-md border hover:bg-muted text-sm"><MessageSquare className="w-4 h-4 mr-1" /> SMS</a>
                          <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => removeContact(c.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setPrimary(c.id)}>Set Primary</Button>
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
                <CardTitle>Nearby Services</CardTitle>
                <CardDescription>Quick links to search on Maps.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2">
                {quickServices.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a key={s.label} href={mapsSearchUrl(s.query)} className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted" target="_blank" rel="noreferrer">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <span>{s.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Open</span>
                    </a>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical ID</CardTitle>
                <CardDescription>Store critical info for responders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> You can add allergies, conditions, or medications in your phone's Health app for lock-screen access.</div>
                <div className="flex items-center gap-2"><Ambulance className="w-4 h-4" /> Keep an emergency card in your wallet.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
