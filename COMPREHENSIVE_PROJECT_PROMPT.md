# Urban Space - Comprehensive Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Features & Specifications](#features--specifications)
4. [UI Component Library & Design System](#ui-component-library--design-system)
5. [Data Models & Storage Schema](#data-models--storage-schema)
6. [State Management & Data Flow](#state-management--data-flow)
7. [Code Patterns & Best Practices](#code-patterns--best-practices)
8. [Navigation & Routing](#navigation--routing)
9. [Responsive Design](#responsive-design)
10. [Browser APIs & Integration](#browser-apis--integration)

---

## Project Overview

### Application Identity
- **Name**: Urban Space
- **Tagline**: Smart Urban Living
- **Subtitle**: Your smart companion for urban living
- **Purpose**: Centralized platform for urban residents to track transport, manage city services, report infrastructure issues, and engage with their community

### Core Value Proposition
Urban Space solves the fragmentation problem where urban residents need to use multiple apps for different city services. It provides:
- **Real-time transportation tracking** (buses & trains)
- **Community event discovery** and attendance
- **Infrastructure issue reporting** with geolocation
- **Lost & found community portal**
- **Neighborhood social feed**
- **Emergency contact management** with SOS
- **Waste management schedules**

### Target Users
- Urban residents (18-65 years old)
- Community members
- City service users
- Environmental advocates

### Brand Colors & Visual Identity
- **Primary Brand Color**: Blue/Gradient (from primary to accent)
- **App Logo**: MapPin icon in white on gradient background
- **App Icon Background**: Rounded square (border-radius: 0.5rem) gradient background
- **Visual Style**: Modern, clean, card-based interface with soft shadows

---

## Architecture & Tech Stack

### Technology Stack

#### Frontend
- **React 18.3.1**: UI library with hooks-based component architecture
- **React Router 6.30.1**: Client-side SPA routing with 8 main routes
- **TypeScript 5.9.2**: Static typing for type safety
- **Vite 7.1.2**: Lightning-fast build tool with hot module replacement
- **TailwindCSS 3.4.17**: Utility-first CSS framework for styling
- **Lucide React 0.539.0**: SVG icon library (40+ icons used throughout)

#### Form & Data Handling
- **react-hook-form 7.62.0**: Efficient form state management
- **Zod 3.25.76**: Schema validation
- **react-day-picker 9.8.1**: Date selection component (used in Events)

#### UI & Notifications
- **Radix UI**: Headless UI components (40+ components from individual packages)
- **Sonner 1.7.4**: Toast notification system
- **Tailwind Merge 2.6.0**: Utility-first CSS merging
- **Class Variance Authority 0.7.1**: Component variant management

#### State Management
- **React Hooks** (useState, useEffect, useMemo, useCallback): Built-in state management
- **localStorage**: Client-side data persistence (no backend database)
- **TanStack React Query 5.84.2**: Query client (initialized but minimal usage)

#### Backend (Minimal)
- **Express 5.1.0**: Node.js web framework
- **serverless-http 3.2.0**: Serverless HTTP handler for Netlify Functions
- **dotenv 17.2.1**: Environment variable management

#### Developer Tools
- **Vitest 3.2.4**: Unit testing framework
- **Prettier 3.6.2**: Code formatting
- **ESLint**: Linting (via TypeScript config)

### Project Structure
```
urban-space/
├── client/
│   ├── pages/
│   │   ├── Index.tsx              # Home / Landing page
│   │   ├── Transport.tsx          # Live transport tracking
│   │   ├── Events.tsx             # Event creation & discovery
│   │   ├── Report.tsx             # Infrastructure issue reporting
│   │   ├── LostFound.tsx          # Lost & found portal
│   │   ├── Community.tsx          # Community feed
│   │   ├── Emergency.tsx          # Emergency contacts & SOS
│   │   ├── Waste.tsx              # Waste management schedules
│   │   ├── NotFound.tsx           # 404 error page
│   │   └── PlaceholderPage.tsx    # Placeholder for future features
│   ├── components/
│   │   ├── home/
│   │   │   └── RecentActivities.tsx  # Dashboard aggregating all activities
│   │   ├── ui/                       # Radix UI component wrappers (40+ files)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── sonner.tsx
│   │   │   └── ... (35+ more)
│   │   └── Layout.tsx              # Main app layout with navigation
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   └── utils.ts                # cn() function for className merging
│   ├── App.tsx                      # App entry point with routes
│   ├── global.css                   # Tailwind theme configuration
│   └── vite-env.d.ts
├── server/
│   ├── routes/
│   │   └── demo.ts                  # Example API route
│   └── index.ts                     # Express server setup
├── shared/
│   └── api.ts                       # Shared TypeScript interfaces
├── netlify/
│   └── functions/
│       └── api.ts                   # Netlify Functions handler
├── package.json
├── tsconfig.json
├── vite.config.ts                   # Vite configuration
├── vite.config.server.ts            # Server build configuration
├── tailwind.config.ts               # Tailwind theme tokens
├── postcss.config.js
└── netlify.toml                     # Netlify deployment configuration
```

### Path Aliases
- `@/*`: Maps to `client/` folder (e.g., `@/pages/Index`, `@/components/ui/button`)
- `@shared/*`: Maps to `shared/` folder (e.g., `@shared/api`)

### Development & Build Commands
```bash
pnpm dev              # Start dev server (Vite + Express)
pnpm build            # Build client & server for production
pnpm build:client     # Build client SPA only
pnpm build:server     # Build server only
pnpm start            # Start production server
pnpm test             # Run Vitest tests
pnpm typecheck        # TypeScript validation
pnpm format.fix       # Format code with Prettier
```

---

## Features & Specifications

### 1. Home / Landing Page (`client/pages/Index.tsx`)

**Purpose**: Welcoming entry point showcasing all city services and aggregated activity from across the app.

**Key Sections**:

#### Hero Section
- Large heading: "Welcome to **Urban Space**" with gradient text
- MapPin icon in branded gradient box
- Subtitle: "Your smart companion for urban living..."
- Full width with background gradient

#### Recent Activities Widget
- Component: `RecentActivities` (embedded from `client/components/home/RecentActivities.tsx`)
- Displays latest entries from all features
- 5-section grid layout (Transport, Events, Reports, Lost & Found, Community)
- Auto-updates every 2 seconds

#### Feature Cards Grid
- 7 service cards in responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- Each card contains:
  - Large colored icon (w-12 h-12)
  - Title (e.g., "Live Transport")
  - Description (e.g., "Real-time bus and train tracking with arrival times")
  - Stats badge (e.g., "5 routes nearby")
  - Arrow indicator for interaction
  - Hover effects (shadow, color transition)

**Service Cards**:
1. **Live Transport** (Bus icon, blue)
   - Link: `/transport`
   - Stats: "5 routes nearby"

2. **Waste Collection** (Trash2 icon, green)
   - Link: `/waste`
   - Stats: "Next: Tomorrow 7AM"

3. **Report Issues** (AlertTriangle icon, orange)
   - Link: `/report`
   - Stats: "3 active reports"

4. **Lost & Found** (Search icon, purple)
   - Link: `/lost-found`
   - Stats: "12 active listings"

5. **Local Events** (Calendar icon, pink)
   - Link: `/events`
   - Stats: "4 events this week"

6. **Emergency** (Phone icon, red)
   - Link: `/emergency`
   - Stats: "Always available"

7. **Community Chat** (MessageSquare icon, indigo)
   - Link: `/community`
   - Stats: "89 active members"

---

### 2. Live Transport (`client/pages/Transport.tsx`)

**Purpose**: Real-time tracking of nearby buses and trains with route information, ETAs, and capacity details.

**Key Features**:

#### Header Section
- Page title: "Live Transport"
- Subtitle: "Real-time arrivals and route information"
- Refresh button with loading spinner
- Last updated timestamp (HH:MM:SS format)

#### Filter Toggle
- 3 state buttons: All / Bus / Train
- Persistent in localStorage as `cityscape_transport_filter`
- Used by RecentActivities component to show filtered routes

#### Quick Stats Dashboard
- 4 stat cards in grid layout:
  1. **Active Buses** (Bus icon, blue background)
     - Count: 24
  2. **Active Trains** (Train icon, green background)
     - Count: 8
  3. **Delays** (AlertCircle icon, orange background)
     - Count: 3
  4. **Avg Wait** (TrendingUp icon, purple background)
     - Value: "8 min"

#### Routes List
- Each route card contains:
  - **Route Type Badge**: Bus/Train icon with colored background (blue for bus, green for train)
  - **Route Number & Name**: "Bus 24 - Downtown Express"
  - **Status Badge**: Color-coded (green=On Time, orange=Delayed, red=Cancelled)
  - **Distance & ETA**: "0.2 km away" | "Arrives in 3 min"
  - **Capacity Progress Bar**: Visual bar with percentage (red if 80%+, orange if 60%+, yellow if 40%+, green otherwise)
  - **Next Stops**: 3 stop names in pill badges, "+X more" if additional stops
  - **Hover Effect**: Shadow increase on hover

**Data Structure**:
```typescript
interface Route {
  id: string;
  number: string;           // "24", "A1"
  name: string;             // "Downtown Express"
  type: "bus" | "train";
  status: "on-time" | "delayed" | "cancelled";
  estimatedArrival: string; // "3 min", "7 min"
  delay?: number;           // minutes
  capacity: number;         // 0-100 percentage
  nextStops: string[];
  distance: string;         // "0.2 km", "1.2 km"
}
```

**Mock Data**: 4 predefined routes (2 buses, 2 trains)

**Auto-Refresh**:
- Manual refresh button with visual feedback
- Auto-refresh every 30 seconds (updates lastUpdated)
- Simulates 1-second API call delay

**localStorage Persistence**:
- Key: `cityscape_transport_snapshot`
- Value: `{ lastUpdatedISO: string, routes: Route[] }`
- Updated on component mount and whenever data changes
- Consumed by RecentActivities component

---

### 3. Events (`client/pages/Events.tsx`)

**Purpose**: Community event discovery, creation, and attendance tracking with calendar-based filtering.

**Key Features**:

#### Event Creation Form
- **Title** (text input, min 3 chars)
- **Category** (dropdown select)
  - Options: Community, Academic, Sports, Cultural, Workshop, Other
- **Description** (textarea, min 10 chars)
- **Location** (text input, min 2 chars)
- **Date** (interactive calendar picker)
  - Highlights days with events using dot indicators
  - Square-shaped day cells
- **Start Time** (HH:MM format, default "10:00")
- **End Time** (HH:MM format, optional, default "12:00")
- **Photos** (file upload, max 5 images)
  - Uses FileReader API for base64 encoding
  - Grid preview of uploaded images

#### Calendar Component
- Styled with square cells (no rounded corners)
- Dot indicators for days with events (pink/primary color dots)
- Click to select date for filtering
- Custom className: `h-9 w-9 text-center text-sm p-0 relative`

#### Events Listing
- **Tab Controls**: Upcoming / Past / All
- **Category Filter** (dropdown): All / Individual categories
- **Date Filter** (calendar-based): Click calendar to filter by date
- **Search Bar** (text input): Searches across title, description, location, category
- **Sort**: Chronological by date (upcoming ascending, past descending)

#### Event Cards (Display List)
- **Event Title** (font-semibold)
- **Category Badge** (styled badge)
- **Status Badge** (color-coded):
  - Blue: "Upcoming"
  - Purple: "Ongoing"
  - Gray: "Completed"
  - Red: "Cancelled"
- **Date & Time**: "Mar 15, 2024 at 2:00 PM"
- **Location** (with MapPin icon)
- **Description** (truncated, line-clamp-2)
- **Attendee Count** (with Users icon)
- **Actions**:
  - "I'm going" button (toggle attendance)
  - Delete button (trash icon)
  - View photos button (if available)

**Data Structure**:
```typescript
interface EventItem {
  id: string;                    // UUID
  title: string;
  category: Category;            // "Community" | "Academic" | etc.
  description: string;
  location: string;
  dateISO: string;              // ISO 8601 start datetime
  endISO?: string;              // ISO 8601 end datetime
  photos: string[];             // Base64 encoded images
  status: EventStatus;          // "upcoming" | "ongoing" | "completed" | "cancelled"
  attendees: number;            // Count of attendees
}

type Category = "Community" | "Academic" | "Sports" | "Cultural" | "Workshop" | "Other";
type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
```

**Status Computation**:
- "upcoming": Start time is in the future
- "ongoing": Current time is between start and end time (default 2 hours if no end)
- "completed": Start time is in the past (and not ongoing)
- "cancelled": Explicitly marked as cancelled

**localStorage Keys**:
- `cityscape_events`: `EventItem[]`
- `cityscape_events_user_status`: `Record<eventId, { going: boolean }>`

---

### 4. Report Infrastructure Issues (`client/pages/Report.tsx`)

**Purpose**: Enable citizens to report and track infrastructure problems (potholes, broken lights, flooding, etc.) with photos and location data.

**Key Features**:

#### Report Creation Form
- **Title** (text input, min 5 chars)
- **Category** (dropdown select)
  - Options: Road Damage, Streetlight Outage, Garbage Overflow, Water Leakage, Power Outage, Other
- **Description** (textarea, min 15 chars)
- **Address** (text input, optional)
- **Coordinates** (auto-captured or manual)
  - Button: "Use My Location" (uses Geolocation API)
  - Displays: "Lat: X.XXX, Lng: Y.YYY" once captured
  - Fallback: Manual address entry
- **Photos** (file upload, max 5 images)
- **Allow Contact** (toggle switch)
  - When enabled, shows:
    - Name (optional)
    - Email (optional)
    - Phone (optional)
  - At least one contact method required if enabled

#### Reports Listing
- **Status Filter** (dropdown): All / Submitted / In Progress / Resolved
- **Category Filter** (dropdown): All / Individual categories
- **Sort**: Most recent first

#### Report Cards (Display List)
- **Report Title** (font-semibold)
- **Category Badge** (styled)
- **Status Badge** (color-coded):
  - Blue: "Submitted"
  - Orange: "In Progress"
  - Green: "Resolved"
- **Date & Time**: Formatted locale string
- **Address/Description**: Truncated text
- **Photos** (thumbnail grid if available)
- **Actions**:
  - Status dropdown to change status (for admin/moderator)
  - Delete button
  - View full details

**Data Structure**:
```typescript
interface ReportItem {
  id: string;                    // UUID
  title: string;
  category: ReportCategory;
  description: string;
  address?: string;
  coords?: Coords;              // { lat, lng }
  photos: string[];             // Base64 encoded images
  status: ReportStatus;         // "submitted" | "in-progress" | "resolved"
  createdAt: string;            // ISO 8601
  contact?: ReportContact;
}

interface Coords {
  lat: number;
  lng: number;
}

interface ReportContact {
  allowContact: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

type ReportCategory = "Road Damage" | "Streetlight Outage" | "Garbage Overflow" | "Water Leakage" | "Power Outage" | "Other";
type ReportStatus = "submitted" | "in-progress" | "resolved";
```

**Geolocation Integration**:
- Uses `navigator.geolocation.getCurrentPosition()`
- High accuracy mode
- 10-second timeout
- Success: Captures latitude/longitude
- Failure: Toast notification suggesting manual entry

**localStorage Key**:
- `cityscape_reports`: `ReportItem[]`

---

### 5. Lost & Found (`client/pages/LostFound.tsx`)

**Purpose**: Community-powered portal for posting and finding lost or found items with geographic context.

**Key Features**:

#### Item Type Toggle
- Two tabs: **Lost** / **Found**
- Switches between lost and found item views

#### Item Creation Form
- **Type** (toggle: Lost / Found)
- **Title** (text input, min 3 chars)
- **Description** (textarea, min 10 chars)
- **Category** (dropdown select)
  - Options: Electronics, Accessories, Documents, Pet, Clothing, Other
- **Location** (text input, optional)
- **Photos** (file upload, max 5 images)
- **Allow Contact** (toggle switch)
  - When enabled, shows:
    - Name (optional)
    - Email (optional)
    - Phone (optional)

#### Items Listing
- **Active Type Filter**: Only show Lost or Found items
- **Category Filter** (dropdown): All / Individual categories
- **Status Filter** (dropdown): All / Open / Claimed / Returned
- **Search Bar**: Searches title, description, location, category
- **Sort**: Most recent first

#### Item Cards (Display List)
- **Item Title**: "Lost: Blue Backpack" or "Found: Red Wallet"
- **Category Icon** (category-specific):
  - Electronics: Smartphone icon
  - Accessories: PackageOpen icon
  - Documents: FileText icon
  - Pet: PawPrint icon
  - Clothing: Shirt icon
  - Other: PackageOpen icon
- **Category & Status Badges** (colored)
- **Location** (with MapPin icon, if available)
- **Date**: Posted when (locale string)
- **Description** (truncated)
- **Photos** (thumbnail grid if available)
- **Contact Info** (if allow contact was checked)
- **Actions**:
  - Status dropdown to update (Open → Claimed → Returned)
  - Delete button

**Data Structure**:
```typescript
interface LFItem {
  id: string;                    // UUID
  type: "lost" | "found";
  title: string;
  description: string;
  category: Category;
  location?: string;
  coords?: Coords;
  dateISO: string;              // ISO 8601 creation date
  photos: string[];             // Base64 encoded images
  status: ItemStatus;           // "open" | "claimed" | "returned"
  contact?: ContactInfo;
}

interface ContactInfo {
  allowContact: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

type Category = "Electronics" | "Accessories" | "Documents" | "Pet" | "Clothing" | "Other";
type ItemStatus = "open" | "claimed" | "returned";
```

**localStorage Key**:
- `cityscape_lostfound`: `LFItem[]`

---

### 6. Community Feed (`client/pages/Community.tsx`)

**Purpose**: Social hub for neighborhood communication, event coordination, safety alerts, and peer-to-peer help.

**Key Features**:

#### Post Creation Card
- **Author Name** (text input, optional, defaults to "Anonymous")
- **Topic** (dropdown select)
  - Options: General, Safety, Events, Lost & Found, Help
- **Content** (textarea, min 3 chars)
- **Photos** (file upload, max 4 images)
- Submit button

#### Viewing Options
- **Tab Controls**: New / Top (trending by likes)
- **Topic Filter** (dropdown): All / Individual topics
- **Search Bar**: Searches author, content, topic
- **Sort Logic**:
  - "Top": By likes (descending), then by date (descending)
  - "New": By date (descending)
  - Pinned posts always appear at top

#### Post Cards (Display List)
- **Author Badge** (with User icon or generic)
- **Topic Badge** (colored, styled)
- **Pinned Indicator** (if applicable)
- **Content** (full text, truncated with line-clamp-3 in preview)
- **Photos** (thumbnail grid if available, max 4)
- **Engagement Stats**:
  - Like count (with Heart icon, red if user liked)
  - Comment count (with MessageCircle icon)
- **Timestamp**: "time ago" format
- **Actions**:
  - Like button (toggle, updates count)
  - Comment button (visual only, no implementation yet)
  - Pin button (for admins/post owner)
  - Delete button (for post owner)

**Data Structure**:
```typescript
interface PostItem {
  id: string;                    // UUID
  author?: string;               // Optional, defaults to "Anonymous"
  topic: Topic;
  content: string;
  images: string[];             // Base64 encoded images
  createdAt: string;            // ISO 8601
  likes: number;                // Count of likes
  comments: number;             // Count of comments
  pinned?: boolean;
}

type Topic = "General" | "Safety" | "Events" | "Lost & Found" | "Help";
```

**User State Tracking**:
- Tracks which posts the current user has liked
- Stored separately in localStorage

**localStorage Keys**:
- `cityscape_community_posts`: `PostItem[]`
- `cityscape_community_user`: `{ likes: Record<postId, boolean> }`

---

### 7. Emergency SOS (`client/pages/Emergency.tsx`)

**Purpose**: Quick access to emergency contacts and SOS triggering with geolocation support.

**Key Features**:

#### Immediate Assistance Card
- **Title**: "Immediate Assistance"
- **Description**: "Trigger a call or SMS to your primary emergency contact."
- **Call Button** (with dropdown to select contact)
  - Uses `tel:` protocol to initiate phone call
  - Includes location in SMS (if setting enabled)
- **Include Location in SMS** (toggle switch)
  - When enabled, uses Geolocation API to capture coordinates
  - Appends to SMS message: "My location: [lat],[lng]"
- **SOS Button** (prominent red button with SOS text)
  - Triggers modal confirmation dialog
  - On confirmation: Executes default action (call or SMS)

#### Emergency Contacts Management Card
- **Title**: "Emergency Contacts"
- **Add Contact Form**:
  - Name (text input)
  - Phone (tel input)
  - Category (dropdown): Family, Friend, Healthcare, Other
  - Add button
- **Contact List**:
  - Each contact shows name, phone, category badge
  - Edit option (hover)
  - Delete option (hover)
  - Set as Primary (radio button)
- **Empty State**: "No contacts yet. Add a contact above."

#### Nearby Services Card
- **Title**: "Nearby Services"
- **Links** (hardcoded, opens Google Maps):
  - Ambulance
  - Hospital
  - Police
  - Each link: `Open on Google Maps` button
  - Uses predefined coordinates or current location

#### Medical ID Card
- **Title**: "Medical ID"
- **Information**:
  - Guidance about Health app integration (iOS)
  - Reminder about wallet medical ID card
  - Links to relevant documentation

**Data Structure**:
```typescript
interface Contact {
  id: string;                    // UUID
  name: string;
  phone: string;
  category: "Family" | "Friend" | "Healthcare" | "Other";
  isPrimary: boolean;
}

interface EmergencySettings {
  defaultAction: "call" | "sms";
  includeLocationInSMS: boolean;
  primaryContactId?: string;
}
```

**localStorage Keys**:
- `cityscape_emergency_contacts`: `Contact[]`
- `cityscape_emergency_settings`: `EmergencySettings`

**Geolocation Integration**:
- Uses Geolocation API to capture coordinates for SMS
- Appends to message when "Include location in SMS" is enabled

---

### 8. Waste Management (`client/pages/Waste.tsx`)

**Purpose**: Provides waste collection schedules, statistics, and educational guides.

**Key Features**:

#### Filter Toggle
- Waste Type Filter: All / Recyclables / Organic / Hazardous / General
- Updates displayed schedule

#### Pickup Schedule
- Calendar view showing collection dates
- Waste type indicators (color-coded)
- Next pickup date highlighted

#### Statistics Dashboard
- Total pickups this month
- Recyclables percentage
- Community participation

#### Educational Guides
- Tips for proper waste segregation
- Environmental impact information
- Recycling best practices

**Data**: Currently mock data (no localStorage persistence)

---

### 9. Layout & Navigation (`client/components/Layout.tsx`)

**Purpose**: App-wide layout wrapper providing consistent header, navigation, and footer across all pages.

**Header Section**:
- **Logo Area** (top-left):
  - MapPin icon in gradient box (w-10 h-10)
  - App name: "Urban Space" (text-xl font-bold)
  - Tagline: "Smart Urban Living" (hidden on small screens)
  - Links to home page (`/`)

**Desktop Navigation** (hidden on lg breakpoint below):
- 8 navigation items in horizontal layout:
  1. Home (MapPin icon)
  2. Transport (Bus icon)
  3. Waste (Trash2 icon)
  4. Report Issue (AlertTriangle icon)
  5. Lost & Found (Search icon)
  6. Events (Calendar icon)
  7. Emergency (Phone icon)
  8. Community (MessageSquare icon)
- Active route highlighting (primary background, white text)
- Hover effects (text and background color transitions)

**Mobile Menu** (shown on lg breakpoint below):
- Hamburger button that toggles menu
- Full-width mobile menu with all 8 items
- Active route highlighting
- Click to close menu after navigation

**Bottom Navigation** (mobile only):
- Fixed at bottom of screen
- Shows first 4 navigation items only
- Grid layout (4 columns)
- Icon + label layout
- Color changes based on active route

**Main Content Area**:
- Flexible layout that stretches based on viewport
- Padding adjustments for mobile bottom nav

---

### 10. Recent Activities Dashboard (`client/components/home/RecentActivities.tsx`)

**Purpose**: Real-time aggregation of latest activities from all app features displayed on the home page.

**Behavior**:
- Polls localStorage every 2 seconds
- Listens to `focus` and `storage` events for cross-tab updates
- Auto-updates when user returns to tab or data changes elsewhere

**Layout**:
- 5 section cards in grid layout (1 column mobile, 2 columns tablet/desktop)
- Each section contains up to 4 items (except Transport which respects filter)

**Sections**:

#### 1. Recent Transport
- **Title**: "Recent Transport"
- **Subtitle**: "Live snapshots from Transport"
- Shows up to 4 routes filtered by user's Transport filter preference
- Each route row displays:
  - Bus/Train icon with colored background
  - Route name and number (e.g., "Bus 24 (24)")
  - Status, ETA, and delay info
  - Last updated timestamp
- Empty state: "Open Transport to see live routes."

#### 2. Recent Events
- **Title**: "Recent Events"
- **Subtitle**: "Upcoming and latest events"
- Shows up to 4 most recent events
- Each item displays:
  - Calendar icon with background
  - Event title
  - Category & status badges
  - Location or description
  - Time ago (e.g., "2h ago")
- Empty state: "No events yet."

#### 3. Recent Reports
- **Title**: "Recent Reports"
- **Subtitle**: "Infrastructure issues"
- Shows up to 4 most recent reports
- Each item displays:
  - AlertTriangle icon with background
  - Report title
  - Category & status badges
  - Address or description
  - Time ago
- Empty state: "No reports yet."

#### 4. Recent Lost & Found
- **Title**: "Recent Lost & Found"
- **Subtitle**: "Latest community listings"
- Shows up to 4 most recent items
- Each item displays:
  - Search icon with background
  - Item title (prefixed with "Lost:" or "Found:")
  - Category & status badges
  - Location or description
  - Time ago
- Empty state: "No items yet."

#### 5. Recent Community Posts
- **Title**: "Recent Community Posts"
- **Subtitle**: "Newest discussions"
- Shows up to 4 most recent posts
- Each item displays:
  - MessageSquare icon with background
  - Post author (or "Anonymous")
  - Topic badge
  - Content preview (truncated)
  - Time ago
- Empty state: "No posts yet."

**Bottom Navigation Links** (if content exists):
- Quick access buttons to main feature pages:
  - Transport, Events, Report, Lost & Found, Community

**Time Formatting**:
```
< 60 seconds: "Xs ago" (e.g., "45s ago")
< 60 minutes: "Xm ago" (e.g., "30m ago")
< 24 hours: "Xh ago" (e.g., "5h ago")
< 7 days: "Xd ago" (e.g., "2d ago")
>= 7 days: Locale date string (e.g., "3/15/2024")
```

---

## UI Component Library & Design System

### Radix UI Component Wrappers

The application uses 40+ reusable UI components wrapping Radix UI primitives. Located in `client/components/ui/`.

**Core Components Used Throughout**:

#### Form Components
- **Button** (`button.tsx`)
  - Variants: default, primary, secondary, destructive, ghost, outline
  - Sizes: sm, md, lg
  - States: disabled, loading
  - Used everywhere for CTAs and actions

- **Input** (`input.tsx`)
  - Text input field
  - Supports type variations: text, email, tel, password, etc.
  - Placeholder text support
  - Validation styling

- **Textarea** (`textarea.tsx`)
  - Multi-line text input
  - Resizable (vertical)
  - Used for descriptions, content

- **Select** (`select.tsx`)
  - SelectTrigger, SelectContent, SelectItem, SelectValue
  - Dropdown component for category/filter selection
  - Searchable (via component implementation)

- **Checkbox** (`checkbox.tsx`)
  - Binary toggle for agreements, preferences
  - Indeterminate state support

- **Radio Group** (`radio-group.tsx`)
  - Single selection from multiple options
  - Used for type toggles (e.g., Lost/Found)

- **Switch** (`switch.tsx`)
  - Toggle switch for boolean settings
  - Used for "Include location in SMS", "Allow Contact", etc.

#### Display Components
- **Card** (`card.tsx`)
  - Card container with CardHeader, CardTitle, CardDescription, CardContent, CardFooter
  - Rounded borders, box shadow
  - Main content container throughout app

- **Badge** (`badge.tsx`)
  - Inline label/tag component
  - Variants: default, secondary, destructive, outline
  - Used for status, category, topic indicators

- **Separator** (`separator.tsx`)
  - Horizontal or vertical divider
  - Used to section content within cards

#### Navigation Components
- **Tabs** (`tabs.tsx`)
  - TabsList, TabsTrigger, TabsContent
  - Used for switching between views (Events tabs, Community tabs, etc.)

#### Calendar & Date
- **Calendar** (`calendar.tsx`)
  - Interactive date picker (from react-day-picker)
  - Custom styling with square cells
  - Dot indicators for event days
  - Used in Events page for date selection

#### Notification & Dialog
- **Toast / Toaster** (`toast.tsx`, `toaster.tsx`)
  - Toast notifications via `useToast()` hook
  - Used for success, error, info messages

- **Sonner** (`sonner.tsx`)
  - Toast provider (alternative/complementary to Toaster)
  - Real-time notifications

- **AlertDialog** (`alert-dialog.tsx`)
  - Modal confirmation dialog
  - Used for SOS confirmation, delete confirmations

- **Dialog** (`dialog.tsx`)
  - General-purpose modal dialog
  - Used for detailed views or forms

- **Tooltip** (`tooltip.tsx`)
  - Hover tooltips
  - Used for additional context on icons/buttons

#### Additional Components (40+ total)
- Accordion, Avatar, Breadcrumb, Collapsible, Command, ContextMenu, DropdownMenu, HoverCard, Label, MenuBar, NavigationMenu, Popover, Progress, ScrollArea, Slider, Table, Pagination, Drawer, Resizable, Scroll-to-top, and more.

### Design System & Tokens

#### Color Palette

**Theme Colors** (Tailwind CSS):
```
Primary: Blue gradient (used for branding, active states)
Secondary: Muted variant (used for backgrounds, inactive states)
Accent: Complementary gradient color
Foreground: Text color (dark on light backgrounds)
Muted Foreground: Secondary text color
Background: Page background
Card: Card background (slightly different from page background)
Border: Border color for inputs, cards, separators
```

**Status Colors**:
- **Success / Green**: `#10B981` (resolved, completed, on-time)
- **Warning / Orange**: `#F59E0B` (in-progress, delayed)
- **Error / Red**: `#EF4444` (cancelled, emergency)
- **Info / Blue**: `#3B82F6` (submitted, upcoming)

**Service-Specific Colors**:
- **Transport**:
  - Bus: Blue (#3B82F6)
  - Train: Green (#10B981)
- **Events**: Pink/Magenta
- **Reports**: Orange
- **Lost & Found**: Purple
- **Community**: Indigo
- **Emergency**: Red
- **Waste**: Green

#### Typography

**Font Family**: System fonts (via Tailwind default)

**Font Sizes & Weights**:
- **Page Headings** (h1): 32px-48px, font-bold (700)
- **Section Titles** (h2): 24px-32px, font-bold (700)
- **Card Titles** (h3): 18px-20px, font-semibold (600)
- **Body Text**: 16px, font-normal (400)
- **Small Text**: 12px-14px, font-normal (400)
- **Labels**: 14px, font-medium (500)
- **Badge Text**: 12px, font-medium (500)

#### Spacing

**Base Unit**: 8px (via Tailwind `p-*`, `m-*`, `gap-*` utilities)

**Common Spacing Values**:
- `p-2`: 8px
- `p-3`: 12px
- `p-4`: 16px
- `p-6`: 24px
- `p-8`: 32px
- `gap-2`: 8px
- `gap-3`: 12px
- `gap-4`: 16px
- `gap-6`: 24px

**Container Padding**: `px-4 sm:px-6 lg:px-8` (responsive)

#### Border Radius

- **Small** (inputs, badges): `rounded-lg` (0.5rem)
- **Medium** (cards, buttons): `rounded-xl` (0.75rem)
- **Large** (feature cards): `rounded-2xl` (1rem)
- **Full** (avatars, circles): `rounded-full`

#### Shadows

- **Subtle**: `shadow-sm`
- **Default**: `shadow` or `shadow-md`
- **Elevated**: `shadow-lg`
- **Used on**: Card hover states, modals

#### Icons

**Library**: Lucide React (v0.539.0)

**Icon Sizes**:
- **Navigation**: 16px-24px (w-4 h-4 to w-6 h-6)
- **Service Cards**: 24px (w-6 h-6)
- **Feature Icons**: 40-48px (w-10 h-10 to w-12 h-12)
- **Inline Icons**: 16px (w-4 h-4)
- **Section Icons**: 28px (w-7 h-7)

**Commonly Used Icons**:
- MapPin, Bus, Train, Trash2, AlertTriangle, Search, Calendar, Phone, MessageSquare, Upload, Trash2, Heart, Clock, Users, CheckCircle2, MapPin, RefreshCw, Filter, ChevronDown, Menu, X, and 30+ more.

---

## Data Models & Storage Schema

### localStorage Architecture

All application data persists to browser localStorage using a prefix convention: `cityscape_*`

### Complete Schema

```json
{
  "cityscape_events": [
    {
      "id": "uuid",
      "title": "string",
      "category": "Community|Academic|Sports|Cultural|Workshop|Other",
      "description": "string",
      "location": "string",
      "dateISO": "ISO-8601",
      "endISO": "ISO-8601 (optional)",
      "photos": ["base64-string"],
      "status": "upcoming|ongoing|completed|cancelled",
      "attendees": "number"
    }
  ],
  
  "cityscape_events_user_status": {
    "eventId": { "going": "boolean" }
  },
  
  "cityscape_reports": [
    {
      "id": "uuid",
      "title": "string",
      "category": "Road Damage|Streetlight Outage|Garbage Overflow|Water Leakage|Power Outage|Other",
      "description": "string",
      "address": "string (optional)",
      "coords": { "lat": "number", "lng": "number" } (optional),
      "photos": ["base64-string"],
      "status": "submitted|in-progress|resolved",
      "createdAt": "ISO-8601",
      "contact": {
        "allowContact": "boolean",
        "name": "string (optional)",
        "email": "string (optional)",
        "phone": "string (optional)"
      } (optional)
    }
  ],
  
  "cityscape_lostfound": [
    {
      "id": "uuid",
      "type": "lost|found",
      "title": "string",
      "description": "string",
      "category": "Electronics|Accessories|Documents|Pet|Clothing|Other",
      "location": "string (optional)",
      "coords": { "lat": "number", "lng": "number" } (optional),
      "dateISO": "ISO-8601",
      "photos": ["base64-string"],
      "status": "open|claimed|returned",
      "contact": {
        "allowContact": "boolean",
        "name": "string (optional)",
        "email": "string (optional)",
        "phone": "string (optional)"
      } (optional)
    }
  ],
  
  "cityscape_community_posts": [
    {
      "id": "uuid",
      "author": "string (optional, defaults to Anonymous)",
      "topic": "General|Safety|Events|Lost & Found|Help",
      "content": "string",
      "images": ["base64-string"],
      "createdAt": "ISO-8601",
      "likes": "number",
      "comments": "number",
      "pinned": "boolean (optional)"
    }
  ],
  
  "cityscape_community_user": {
    "likes": {
      "postId": "boolean"
    }
  },
  
  "cityscape_emergency_contacts": [
    {
      "id": "uuid",
      "name": "string",
      "phone": "string",
      "category": "Family|Friend|Healthcare|Other",
      "isPrimary": "boolean"
    }
  ],
  
  "cityscape_emergency_settings": {
    "defaultAction": "call|sms",
    "includeLocationInSMS": "boolean",
    "primaryContactId": "uuid (optional)"
  },
  
  "cityscape_transport_snapshot": {
    "lastUpdatedISO": "ISO-8601",
    "routes": [
      {
        "id": "string",
        "number": "string",
        "name": "string",
        "type": "bus|train",
        "status": "on-time|delayed|cancelled",
        "estimatedArrival": "string",
        "delay": "number (optional)",
        "capacity": "number (0-100)",
        "distance": "string"
      }
    ]
  },
  
  "cityscape_transport_filter": "all|bus|train"
}
```

### Data Retrieval Patterns

All pages follow consistent read/write helper patterns:

```typescript
// Read pattern
function readXXX(): XXXItem[] {
  try {
    const raw = localStorage.getItem("cityscape_xxx");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Write pattern
function writeXXX(items: XXXItem[]) {
  localStorage.setItem("cityscape_xxx", JSON.stringify(items));
}

// Component usage
const [data, setData] = useState<XXXItem[]>(() => readXXX());

useEffect(() => {
  writeXXX(data);
}, [data]);
```

### Safety & Error Handling

- **JSON.parse errors**: Wrapped in try/catch, returns empty array
- **Type validation**: Array.isArray() checks before type casting
- **Data mutation**: Always use spread operators or array methods to avoid direct mutations
- **localStorage quota**: No explicit handling (assumed <5MB total)

---

## State Management & Data Flow

### Architecture Overview

Urban Space uses a **localStorage-centric architecture** with React hooks for local component state. No external state management library (Redux, Zustand, etc.) is used.

### State Management Patterns

#### Local Component State
```typescript
const [data, setData] = useState<DataItem[]>(() => readData());
const [filters, setFilters] = useState<FilterState>({ ... });
const [images, setImages] = useState<string[]>([]);
```

#### Persisted State (with localStorage sync)
```typescript
// On mount: Load from localStorage
const [events, setEvents] = useState<EventItem[]>(() => readEvents());

// On change: Sync to localStorage
useEffect(() => {
  writeEvents(events);
}, [events]);
```

#### Computed/Derived State (useMemo)
```typescript
const filtered = useMemo(() => {
  return items
    .filter(item => matches filter criteria)
    .sort(...)
    .slice(0, limit);
}, [items, filterCriteria]);
```

#### Form State (react-hook-form)
```typescript
const form = useForm<FormValues>({
  defaultValues: { ... },
  mode: "onChange",
});

// Validation, submission, reset through form.handleSubmit()
```

### Data Flow Example: Events Feature

1. **Component Mount**:
   - `useState(() => readEvents())` loads events from localStorage
   - `useState(() => readUserStatus())` loads user attendance tracking

2. **User Creates Event**:
   - Form validates via react-hook-form
   - On submit: Create EventItem with UUID, ISO timestamps
   - `setEvents(prev => [...prev, newEvent])` updates state

3. **State Change Triggers Sync**:
   - `useEffect(() => { writeEvents(events) }, [events])`
   - New array serialized to JSON and written to localStorage

4. **Other Pages Detect Changes**:
   - RecentActivities polls localStorage every 2 seconds
   - Listens to `storage` event (cross-tab updates)
   - Re-renders with updated events

5. **Cleanup on Unmount**:
   - useEffect cleanup functions unsubscribe from event listeners
   - localStorage persists data across page reloads/sessions

### Cross-Feature Data Synchronization

**RecentActivities Component Pattern**:
```typescript
useEffect(() => {
  const load = () => {
    // Read from all feature keys
    const events = readEvents();
    const reports = readReports();
    // ... other features
    
    // Filter, sort, aggregate
    const aggregated = [...].slice(0, 4);
    
    // Update state
    setEventItems(aggregated);
  };
  
  // Load on mount
  load();
  
  // Reload every 2 seconds
  const interval = setInterval(load, 2000);
  
  // Listen to tab focus
  window.addEventListener("focus", load);
  
  // Listen to storage changes (other tabs)
  window.addEventListener("storage", load);
  
  // Cleanup
  return () => {
    clearInterval(interval);
    window.removeEventListener("focus", load);
    window.removeEventListener("storage", load);
  };
}, []);
```

### Form Submission Flow

**General Pattern** (using react-hook-form):

1. Define `FormValues` interface with all fields
2. Create `useForm<FormValues>()` instance
3. Wrap form in `Form` context
4. Create `FormField` for each input with validation rules
5. On `form.handleSubmit(onSubmit)`:
   - Validate all fields
   - Call `onSubmit(values)` if valid
   - Show toast notification on success
   - Reset form for next entry
6. Images/uploads handled separately (FileReader API)
   - State array updated before form submission

### Auto-Save Patterns

**Explicit (after state changes)**:
```typescript
useEffect(() => {
  writeData(data);
}, [data]);
```

**Periodic (polling)**:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // Refetch/recompute
  }, 2000);
  return () => clearInterval(interval);
}, []);
```

**Event-Driven**:
```typescript
useEffect(() => {
  const handleStorageChange = () => {
    setData(readData());
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
```

---

## Code Patterns & Best Practices

### Component Structure

**Typical Page Component Pattern**:
```typescript
// Imports
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ... other imports

// Types & Interfaces
interface DataItem { ... }
interface FormValues { ... }

// Local Helper Functions
function readData(): DataItem[] { ... }
function writeData(items: DataItem[]) { ... }

// Main Component
export default function FeaturePage() {
  // State
  const [data, setData] = useState<DataItem[]>(() => readData());
  const [filters, setFilters] = useState<FilterState>({ ... });
  const [images, setImages] = useState<string[]>([]);
  
  // Hooks
  const { toast } = useToast();
  const form = useForm<FormValues>({ ... });
  
  // Effects
  useEffect(() => {
    writeData(data);
  }, [data]);
  
  // Derived state
  const filtered = useMemo(() => {
    return data.filter(...);
  }, [data, filters]);
  
  // Handlers
  const onSubmit = (values: FormValues) => {
    // Validation
    // Creation
    // State update
    // Toast notification
  };
  
  const handleFiles = async (fileList: FileList | null) => {
    // FileReader loop
    // Base64 encoding
    // State update
  };
  
  // Render
  return (
    <div className="container">
      <Form {...form}>
        {/* Form fields */}
      </Form>
      
      <div className="grid">
        {/* Item cards */}
      </div>
    </div>
  );
}
```

### Error Handling

**localStorage Parse Errors**:
```typescript
try {
  const parsed = JSON.parse(localStorage.getItem(key));
  return Array.isArray(parsed) ? parsed : [];
} catch {
  return [];
}
```

**Geolocation Errors**:
```typescript
navigator.geolocation.getCurrentPosition(
  (pos) => {
    // Success: use pos.coords.latitude, pos.coords.longitude
  },
  () => {
    // Error: show toast, suggest manual entry
    toast({ title: "Location denied" });
  },
  { enableHighAccuracy: true, timeout: 10000 }
);
```

**File Upload Errors**:
```typescript
try {
  const results = await Promise.all(readers);
  setImages(prev => [...prev, ...results].slice(0, maxImages));
} catch {
  toast({ title: "Image upload failed" });
}
```

**Form Validation**:
```typescript
if (!values.title || values.title.trim().length < minLength) {
  toast({ title: "Validation error", description: "..." });
  return;
}
```

### Image Handling (FileReader API)

**Read Multiple Files as Base64**:
```typescript
const handleFiles = async (fileList: FileList | null) => {
  if (!fileList) return;
  
  const files = Array.from(fileList).slice(0, maxImages);
  
  const readers = files.map(file =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })
  );
  
  try {
    const results = await Promise.all(readers);
    setImages(prev => [...prev, ...results].slice(0, maxImages));
  } catch {
    toast({ title: "Image upload failed" });
  }
};
```

### Date/Time Handling

**ISO String Storage**:
```typescript
const dateISO = new Date().toISOString();  // "2024-03-15T14:30:00.000Z"
localStorage.setItem("key", JSON.stringify({ dateISO }));
```

**Convert Date + Time to ISO**:
```typescript
function toISO(date: Date, time: string): string {
  const [hh, mm] = time.split(":");
  const d = new Date(date);
  d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
  return d.toISOString();
}
```

**Display Relative Time ("time ago")**:
```typescript
function timeAgo(iso: string): string {
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
```

**Compute Event Status**:
```typescript
function computeStatus(e: EventItem): EventStatus {
  if (e.status === "cancelled") return "cancelled";
  if (isOngoing(e.dateISO, e.endISO)) return "ongoing";
  if (isPast(e.dateISO)) return "completed";
  return "upcoming";
}

function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

function isOngoing(startISO: string, endISO?: string): boolean {
  const now = Date.now();
  const start = new Date(startISO).getTime();
  const end = endISO ? new Date(endISO).getTime() : start + 2 * 60 * 60 * 1000;
  return start <= now && now <= end;
}
```

### UUID Generation

```typescript
const id = crypto.randomUUID();  // Browser native API
```

### Filtering & Sorting

**Combined Filtering Pattern**:
```typescript
const filtered = useMemo(() => {
  return items
    .filter(item => typeFilter === "all" || item.type === typeFilter)
    .filter(item => statusFilter === "all" || item.status === statusFilter)
    .filter(item => {
      const q = query.trim().toLowerCase();
      return !q || [item.title, item.description]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}, [items, typeFilter, statusFilter, query]);
```

### Status Badge Color Mapping

```typescript
function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    "on-time": "text-green-600 bg-green-100",
    "delayed": "text-orange-600 bg-orange-100",
    "cancelled": "text-red-600 bg-red-100",
    "submitted": "bg-blue-100 text-blue-700",
    "in-progress": "bg-orange-100 text-orange-700",
    "resolved": "bg-green-100 text-green-700",
  };
  return colors[status] || "text-gray-600 bg-gray-100";
}
```

### Utility Functions

**Class Name Merging** (`cn` function):
```typescript
// From lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
className={cn(
  "base-class p-4",
  { "conditional-class": condition },
  props.className  // Allow overrides
)}
```

---

## Navigation & Routing

### Route Configuration

**Defined in `client/App.tsx`**:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/transport" element={<Transport />} />
  <Route path="/waste" element={<Waste />} />
  <Route path="/report" element={<Report />} />
  <Route path="/lost-found" element={<LostFound />} />
  <Route path="/events" element={<Events />} />
  <Route path="/emergency" element={<Emergency />} />
  <Route path="/community" element={<Community />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Navigation Menu Items

**Defined in `client/components/Layout.tsx`**:

```typescript
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
```

### Active Route Detection

```typescript
const location = useLocation();
const isActive = location.pathname === item.href;

className={cn(
  "transition-colors",
  isActive
    ? "bg-primary text-primary-foreground"
    : "text-muted-foreground hover:text-foreground"
)}
```

### Internal Navigation

**Link Component Usage**:
```typescript
import { Link } from "react-router-dom";

<Link to="/events" className="...">
  Go to Events
</Link>
```

---

## Responsive Design

### Tailwind Breakpoints Used

- **Mobile (default)**: 0px and up (full width, single column)
- **Tablet (md)**: 768px and up
- **Desktop (lg)**: 1024px and up
- **Large Desktop (xl)**: 1280px and up

### Responsive Patterns

**Grid Layouts**:
```typescript
// 1 col mobile, 2 cols tablet, 3 cols desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// 1 col mobile, 2 cols desktop
className="grid grid-cols-1 lg:grid-cols-2 gap-6"
```

**Hidden Elements**:
```typescript
// Desktop nav hidden on mobile
className="hidden lg:flex space-x-1"

// Mobile menu button hidden on desktop
className="lg:hidden p-2"

// Bottom nav hidden on desktop
className="lg:hidden fixed bottom-0"
```

**Padding Adjustments**:
```typescript
// Responsive padding
className="px-4 sm:px-6 lg:px-8 pt-8"

// Responsive text size
className="text-3xl md:text-4xl lg:text-5xl"
```

**Mobile Bottom Navigation Offset**:
```typescript
// Page content
className="pb-20 lg:pb-0"  // 20 (5rem) for mobile nav, 0 for desktop

// Fixed bottom nav
className="lg:hidden fixed bottom-0 left-0 right-0"
```

### Container Pattern

```typescript
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

---

## Browser APIs & Integration

### localStorage API

**Read Data**:
```typescript
const raw = localStorage.getItem("cityscape_key");
const data = raw ? JSON.parse(raw) : null;
```

**Write Data**:
```typescript
localStorage.setItem("cityscape_key", JSON.stringify(data));
```

**Keys Used**: 10 main keys (see Data Models section)

### Geolocation API

**Get Current Position**:
```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    setCoords({ lat: latitude, lng: longitude });
  },
  (error) => {
    console.error("Geolocation error:", error);
    showToast("Location access denied");
  },
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
);
```

**Used In**: Report, Lost & Found (optional), Emergency (SOS with location)

### FileReader API

**Read File as Base64**:
```typescript
const reader = new FileReader();
reader.onload = () => {
  const base64 = String(reader.result);
  setImages(prev => [...prev, base64]);
};
reader.onerror = () => handleError();
reader.readAsDataURL(file);
```

**Used In**: Events, Reports, Lost & Found, Community (photo uploads)

### crypto.randomUUID()

**Generate Unique ID**:
```typescript
const id = crypto.randomUUID();  // "550e8400-e29b-41d4-a716-446655440000"
```

**Used In**: All data item creation (Events, Reports, Lost & Found, Community, Emergency Contacts)

### Date & Time APIs

**Current Timestamp**:
```typescript
const now = new Date().toISOString();
const timestamp = Date.now();  // Milliseconds since epoch
```

**Date Formatting**:
```typescript
new Date(isoString).toLocaleString();       // "3/15/2024, 2:30:00 PM"
new Date(isoString).toLocaleDateString();   // "3/15/2024"
new Date(isoString).toLocaleTimeString();   // "2:30:00 PM"
```

**Used In**: All timestamp fields, display formatting

### Window Events

**Focus Event** (tab became active):
```typescript
window.addEventListener("focus", () => {
  reloadData();
});
```

**Storage Event** (localStorage changed in another tab):
```typescript
window.addEventListener("storage", (e) => {
  if (e.key === "cityscape_events") {
    reloadData();
  }
});
```

**Used In**: RecentActivities for cross-tab synchronization

### Navigator APIs

**Geolocation**: Already covered above

**User Agent Detection**:
```typescript
const isMobile = window.innerWidth < 768;  // Manual breakpoint check
```

---

## Additional Implementation Details

### Toast Notifications

**Hook Usage**:
```typescript
const { toast } = useToast();

toast({
  title: "Success",
  description: "Item created successfully",
});

toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});
```

**Variants**: default, destructive

### Form Validation

**Using react-hook-form + Zod** (optional):
```typescript
const form = useForm<FormValues>({
  defaultValues: { ... },
  mode: "onChange",  // Validate on field change
});

// Validate before submission
if (!values.title.trim()) {
  toast({ title: "Title is required" });
  return;
}
```

### Modal Dialogs

**AlertDialog for Confirmation**:
```typescript
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button>Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={handleDelete}>
      Delete
    </AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

### Skeleton Loading States

Currently not implemented, but pattern would use conditional rendering:
```typescript
{isLoading ? <SkeletonCard /> : <DataCard />}
```

### Accessibility Considerations

- Alt text for icons (implicit via Lucide)
- Semantic HTML (form, fieldset, label)
- ARIA labels on custom components
- Keyboard navigation support (via Radix UI)
- Focus management (Dialog component)

---

## Server Architecture (Minimal)

### Express Setup

**`server/index.ts`**:
```typescript
import express from "express";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  
  // Routes
  app.get("/api/ping", (req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });
  app.get("/api/demo", handleDemo);
  
  return app;
}
```

### Demo Route

**`server/routes/demo.ts`**:
```typescript
import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "Hello from Express server"
  };
  res.json(response);
};
```

### Shared Types

**`shared/api.ts`**:
```typescript
export interface DemoResponse {
  message: string;
}
```

### Netlify Functions Deployment

**`netlify/functions/api.ts`**:
```typescript
import { createServer } from "../../server";
import serverless from "serverless-http";

const server = createServer();
export const handler = serverless(server);
```

---

## Performance Considerations

### localStorage Limits
- Typical limit: 5-10MB per domain
- Current app likely under 1MB with mock data
- No optimization needed for current scope

### Polling Interval
- RecentActivities polls every 2 seconds (reasonable for perceived freshness)
- Transport auto-refresh every 30 seconds (to avoid excessive UI updates)
- Consider increasing if performance issues arise

### useMemo Usage
- Applied to filtering/sorting expensive operations
- Prevents re-renders when dependencies haven't changed
- Used extensively in list filtering

### Event Listeners
- Focus and storage events properly cleaned up in useEffect return
- No memory leaks from event handlers

### Image Storage
- Base64 encoding increases data size by ~33%
- Max 5 images per item * multiple items = potential growth
- Consider compression if storage becomes an issue

---

## Future Enhancement Opportunities

1. **Backend Database Integration**:
   - Replace localStorage with Supabase/PostgreSQL
   - Add user authentication
   - Enable real data persistence

2. **Real-time Features**:
   - WebSocket integration for live transport updates
   - Real-time notifications
   - Collaborative features (comments, reactions)

3. **Map Integration**:
   - Google Maps/Leaflet integration
   - Location-based services
   - Route visualization

4. **User Accounts**:
   - Authentication system
   - User profiles
   - Personalized preferences

5. **Media Upload**:
   - Replace base64 with CDN/cloud storage
   - Image compression
   - Progressive image loading

6. **Advanced Filtering**:
   - Geospatial filtering
   - Date range filters
   - Complex query builder

7. **Notifications**:
   - Push notifications
   - Email digests
   - SMS alerts

8. **Analytics**:
   - User behavior tracking
   - Feature usage metrics
   - Performance monitoring

---

## Summary

Urban Space is a well-architected, localStorage-based urban services application built with React, TypeScript, and Tailwind CSS. It provides:

- **9 core features** (Transport, Events, Reports, Lost & Found, Community, Emergency, Waste, Home, Navigation)
- **Comprehensive UI library** (40+ components from Radix UI)
- **Responsive design** (mobile-first, works on all screen sizes)
- **Persistent data** (localStorage-based state management)
- **Real-time updates** (polling, cross-tab synchronization)
- **Modern tooling** (Vite, TypeScript, TailwindCSS)

The codebase follows consistent patterns, prioritizes user experience, and is maintainable for future enhancements.

