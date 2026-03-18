# API INTEGRATION — PUBLIC WEBSITE PROJECTS SECTION
## Project: gottwald-website (Next.js — App Router)

---

## CONTEXT

This is an existing Next.js public website.
- App Router, TypeScript, Tailwind CSS v4
- `src/lib/types/project.ts` already exists with the full Project type
- The Projects section is a **server component**
- Project data is currently **hardcoded directly inside the component**

Goal: move the hardcoded data into a proper API layer with mock support.
When the backend API is ready → change one value in `.env.local` → done.
Zero component changes required after that.

---

## WHAT TO BUILD

```
src/
├── .env.local                         ← add two new variables
├── .env.local.example                 ← document the variables
└── lib/
    ├── types/
    │   └── project.ts                 ← already exists, do not touch
    ├── mock/
    │   └── projects.mock.ts           ← extract hardcoded data here
    └── api/
        └── projects.ts                ← all data fetching lives here
```

Only these files are created or modified.
Do NOT touch the component files — only the data source changes.

---

## STEP 1 — ENVIRONMENT FILE

Create `.env.local` in the root of the project:

```bash
# .env.local

# Controls where data comes from
# "mock"  → uses local mock data (right now)
# "api"   → calls the real backend (when backend is ready)
NEXT_PUBLIC_DATA_SOURCE=mock

# Backend API base URL — fill this in when backend is ready
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `.env.local.example` with the same content so it is documented:

```bash
# .env.local.example
NEXT_PUBLIC_DATA_SOURCE=mock
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## STEP 2 — MOCK DATA FILE

Create `src/lib/mock/projects.mock.ts`.

Take the hardcoded project data from the component and move it here exactly.
Type it strictly as `Project[]` using the existing type.

```typescript
import { Project } from "../types/project";

export const MOCK_PROJECTS: Project[] = [
  {
    slug: "solution-finder",
    title: "SolutionFinder & Management",
    tags: ["STRATEGY", "CLARITY"],
    image: "/assets/projects/solution-finder-scifi.png",
    launchUrl: "https://google.com/",
    description: "Every Complex Situation Has a Structure.",
    details:
      "When people, processes, technology and decisions interact, complexity becomes inevitable. SolutionFinder creates clarity through structured analysis. Solution Management drives resolution — a situation is solved when it no longer creates operational friction.",
    services: [
      "Structured Analysis",
      "Root Cause Diagnostics",
      "Implementation Support",
      "Systemic Resolution",
    ],
    contentBlocks: [
      {
        id: "block-1",
        type: "rich-text",
        theme: "light",
        heading: "Deconstructing Complexity",
        body: "<p>SolutionFinder creates clarity through structured analysis.</p>",
        image: "/assets/projects/solution-finder-scifi.png",
      },
      {
        id: "block-2",
        type: "rich-text",
        theme: "dark",
        heading: "The Framework",
        body: "<h3>Phase 1: Diagnostics</h3><p>We isolate the exact operational bottlenecks.</p><h3>Phase 2: Resolution</h3><p>A situation is truly solved only when it requires zero daily mental energy from ownership.</p>",
      },
      {
        id: "block-3",
        type: "rich-text",
        theme: "dark",
        image: "/assets/projects/solution-finder-scifi.png",
      },
    ],
    theme: {
      background: "#121212",
      text: "#F5F5F5",
      accent: "#A8B4B8",
    },
  },
  // Add any other existing hardcoded projects here in the same shape
];
```

---

## STEP 3 — API LAYER

Create `src/lib/api/projects.ts`:

```typescript
import { Project } from "../types/project";
import { MOCK_PROJECTS } from "../mock/projects.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_DATA_SOURCE === "mock";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── HELPER ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 }, // ISR — revalidate data every 60 seconds
  });
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${endpoint}`);
  }
  return res.json();
}

// ─── GET ALL PROJECTS ─────────────────────────────────────────────────────────
// Used in the Projects section to render all project cards

export async function getProjects(): Promise<Project[]> {
  if (USE_MOCK) return MOCK_PROJECTS;
  return apiFetch<Project[]>("/api/projects");
}

// ─── GET SINGLE PROJECT BY SLUG ───────────────────────────────────────────────
// Used in individual project detail pages (if they exist)

export async function getProject(slug: string): Promise<Project | undefined> {
  if (USE_MOCK) return MOCK_PROJECTS.find((p) => p.slug === slug);
  return apiFetch<Project>(`/api/projects/${slug}`);
}

// ─── GET ALL SLUGS ────────────────────────────────────────────────────────────
// Used in generateStaticParams for dynamic project routes

export async function getAllProjectSlugs(): Promise<string[]> {
  if (USE_MOCK) return MOCK_PROJECTS.map((p) => p.slug);
  const projects = await apiFetch<Project[]>("/api/projects");
  return projects.map((p) => p.slug);
}
```

---

## STEP 4 — UPDATE THE PROJECTS COMPONENT

Find the Projects section server component where the data is currently hardcoded.

Make only this change — replace the hardcoded array with a call to `getProjects()`:

**Before:**
```typescript
// Remove this — whatever the hardcoded array looks like
const projects = [
  { slug: "...", title: "...", ... },
  { slug: "...", title: "...", ... },
];
```

**After:**
```typescript
import { getProjects } from "@/lib/api/projects";

// Add this — one line replaces the entire hardcoded block
const projects = await getProjects();
```

The component renders exactly the same way as before.
The only change is where the data comes from.

---

## STEP 5 — IF DYNAMIC PROJECT DETAIL PAGES EXIST

If the project has individual pages like `/projects/[slug]`, update them too.

```typescript
// In the dynamic route page — src/app/projects/[slug]/page.tsx
import { getProject, getAllProjectSlugs } from "@/lib/api/projects";

// Generate static pages at build time
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Fetch single project — replace hardcoded data with this
const project = await getProject(params.slug);
if (!project) notFound();
```

If these pages do not exist yet, skip this step.

---

## SWITCHING TO REAL API WHEN BACKEND IS READY

When the backend developer provides the API, make this single change in `.env.local`:

```bash
# Change this one line:
NEXT_PUBLIC_DATA_SOURCE=api

# Add the real backend URL:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

Nothing else changes. No component edits. No refactoring.
`getProjects()` automatically calls the real API instead of mock.

---

## EXPECTED API ENDPOINTS (share with backend developer)

```
GET /api/projects
  Response: Project[]

GET /api/projects/:slug
  Response: Project

Project shape:
{
  slug: string
  title: string
  tags: string[]
  image: string
  launchUrl: string
  description: string
  details: string
  services: string[]
  contentBlocks: ContentBlock[]
  theme: { background: string, text: string, accent: string }
}
```

---

## BUILD ORDER

```
1. Create .env.local and .env.local.example
2. Create src/lib/mock/projects.mock.ts
   → move ALL hardcoded project data into this file
3. Create src/lib/api/projects.ts
4. Update the Projects section component
   → remove hardcoded array
   → import and call getProjects()
5. Update dynamic project pages (if they exist)
6. Run npm run dev — verify projects still render correctly
7. Run npx tsc --noEmit — verify no TypeScript errors
```

---

## DONE WHEN

- [ ] `.env.local` exists with `NEXT_PUBLIC_DATA_SOURCE=mock`
- [ ] All hardcoded project data is removed from components
- [ ] `src/lib/mock/projects.mock.ts` contains all project data typed as `Project[]`
- [ ] `src/lib/api/projects.ts` contains `getProjects`, `getProject`, `getAllProjectSlugs`
- [ ] Projects section renders exactly as before — same visual output
- [ ] `npm run dev` runs clean with no errors
- [ ] `npx tsc --noEmit` passes with no TypeScript errors
