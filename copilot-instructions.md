# MP Manager V2 — Copilot Development Instructions

**Version**: v0.1.0 | **Date**: 2026-01-17 | **Status**: Scaffolding Phase

---

## Project Overview

**MP Manager V2** is a complete rewrite of the MP Manager application — a browser-based Gantt chart scheduling tool for managing maintenance periods (MPs) across multiple naval ships and teams.

**Stack**: React 18 + Hono + Tailwind CSS + Zustand (MVP-focused, no DB layer yet)

**Core Goal**: Build an intuitive, real-time scheduling interface with Gantt visualization, team utilization metrics, and PDF export.

---

## Current Status

✅ **Repository Created**: https://github.com/kwran420/mp-manager-v2
✅ **Dependencies Installed**: 182 packages (React, Vite, Hono, Tailwind, Zustand, Zod, Chart.js)
✅ **Git Initialized**: First commit + `.gitignore` configured

⏳ **Next**: Build Gantt chart component and core data structures

---

## Directory Structure

```
mp-manager-v2/
├── public/                    # Static assets (favicon, etc)
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root router + layout
│   ├── index.html            # HTML template
│   │
│   ├── components/
│   │   ├── ui/               # shadcn/ui or custom UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   │
│   │   ├── gantt/            # Gantt chart modules
│   │   │   ├── GanttChart.tsx       # Main container
│   │   │   ├── GanttTimeline.tsx    # Week/month headers
│   │   │   ├── GanttLane.tsx        # Team row
│   │   │   ├── GanttBar.tsx         # Single MP bar (draggable)
│   │   │   └── GanttStyles.tsx      # Shared styles
│   │   │
│   │   ├── stats/            # Statistics dashboard
│   │   │   ├── StatsPanel.tsx
│   │   │   ├── UtilizationChart.tsx
│   │   │   ├── TeamHeatmap.tsx
│   │   │   └── DateRangeFilter.tsx
│   │   │
│   │   ├── layout/           # Page layouts
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   │
│   │   └── modals/           # Reusable modals
│   │       ├── MPEditModal.tsx
│   │       ├── TeamModal.tsx
│   │       └── ExportModal.tsx
│   │
│   ├── pages/                # Page components (route-level)
│   │   ├── Dashboard.tsx      # Main Gantt view
│   │   ├── Teams.tsx          # Team management
│   │   ├── Settings.tsx       # User preferences
│   │   └── NotFound.tsx
│   │
│   ├── stores/               # Zustand state
│   │   ├── mpStore.ts        # MPs (create, update, delete)
│   │   ├── teamStore.ts      # Teams (add, rename, delete)
│   │   ├── assignmentStore.ts # MP ↔ Team assignments
│   │   ├── uiStore.ts        # UI state (theme, modals, etc)
│   │   └── index.ts          # Export all stores
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useMPs.ts         # Fetch + manage MPs
│   │   ├── useTeams.ts       # Fetch + manage teams
│   │   ├── useKeyboard.ts    # Keyboard shortcuts
│   │   └── useLocalStorage.ts # Persist state
│   │
│   ├── lib/                  # Utilities and helpers
│   │   ├── api.ts            # API client (fetch wrapper)
│   │   ├── dateUtils.ts      # Date calculations (weeks, phases, etc)
│   │   ├── ganttUtils.ts     # Gantt-specific helpers (collision detection, lane stacking)
│   │   ├── exportUtils.ts    # PDF/CSV export logic
│   │   └── validators.ts     # Zod schemas for data validation
│   │
│   ├── styles/
│   │   └── globals.css       # Tailwind base + custom CSS
│   │
│   └── types/
│       └── index.ts          # TypeScript interfaces (MP, Team, Assignment, etc)
│
├── server/
│   ├── index.ts              # Hono app entry point
│   ├── routes/
│   │   ├── mps.ts            # GET /api/mps, POST /api/mps, etc
│   │   ├── teams.ts          # GET /api/teams, POST /api/teams, etc
│   │   ├── assignments.ts    # GET /api/assignments, etc
│   │   └── health.ts         # GET /api/health
│   │
│   ├── middleware/
│   │   ├── auth.ts           # (Future) JWT validation
│   │   └── cors.ts           # CORS headers
│   │
│   └── db/                   # (Future) Database layer
│       ├── schema.ts
│       └── queries.ts
│
├── shared/                   # Shared types between client + server
│   ├── types.ts              # MP, Team, Assignment interfaces
│   └── validation.ts         # Zod schemas (used by client + server)
│
├── .vscode/
│   ├── settings.json         # Editor defaults
│   ├── extensions.json       # Recommended extensions
│   └── launch.json           # Debug config
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── .gitignore
├── .env.example              # Template for .env
├── README.md                 # Dev setup guide
├── copilot-instructions.md   # This file
└── GITHUB_SETUP.md           # Initial GitHub setup
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | Component UI |
| **Build** | Vite | Fast bundler + HMR |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State** | Zustand | Global state (MPs, teams) |
| **Validation** | Zod | Schema validation (client + server) |
| **Backend** | Hono | Lightweight HTTP server |
| **Charts** | Chart.js | Utilization graphs |
| **Animations** | Framer Motion | Smooth transitions |
| **Type Safety** | TypeScript | Full TS coverage |

**Deferred** (Phase 2+):
- Database: Drizzle ORM + SQLite
- Authentication: better-auth (magic links → passkeys)
- PDF Export: @react-pdf/renderer
- Advanced Tables: @tanstack/react-table

---

## Development Workflow

### Start Dev Server
```bash
npm run dev
```
Frontend at http://localhost:5173, backend at http://localhost:3000 (auto-proxied by Vite)

### Build for Production
```bash
npm run build    # TypeScript + Vite bundling
npm run start    # Serves from dist/
```

### Code Organization Rules

1. **Components**: One per file, named `ComponentName.tsx`
2. **State**: Use Zustand stores in `stores/` — never useState for shared data
3. **Hooks**: Extract complex logic into `hooks/` — keep components thin
4. **Types**: All interfaces in `shared/types.ts` or `types/index.ts`
5. **Validation**: Use Zod schemas in `lib/validators.ts`
6. **API calls**: Always via `lib/api.ts` wrapper (enables caching, error handling)
7. **Styling**: Tailwind classes + `globals.css` for base styles

### Naming Conventions

- **Components**: PascalCase (`GanttChart.tsx`)
- **Hooks**: camelCase (`useMPs.ts`)
- **Utils**: camelCase (`dateUtils.ts`)
- **Stores**: camelCase (`mpStore.ts`)
- **Functions**: camelCase (`calculateWeeks()`)
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

---

## Implementation Phases

### Phase 1: Core UI Shell (Days 1-3)
- [ ] Dark mode toggle + Tailwind setup
- [ ] Header, Sidebar, MainLayout
- [ ] Basic routing (Dashboard, Teams, Settings pages)
- [ ] Mock data structures

**Deliverable**: Clickable shell with navigation

### Phase 2: Data Layer (Days 4-5)
- [ ] Define MP, Team, Assignment types in `shared/types.ts`
- [ ] Create Zustand stores (mpStore, teamStore, assignmentStore)
- [ ] Build in-memory data service (no server yet)
- [ ] Create test data fixtures

**Deliverable**: State management working end-to-end

### Phase 3: Gantt Chart Core (Days 6-10) ⭐
- [ ] GanttTimeline: Week/month headers
- [ ] GanttLane: Team rows with styling
- [ ] GanttBar: Single MP bar component
- [ ] Collision detection + lane stacking algorithm
- [ ] Click-to-edit modal integration
- [ ] Scroll + zoom controls

**Deliverable**: Functional Gantt view with draggable bars

### Phase 4: Team Management (Days 11-12)
- [ ] Team CRUD UI (add, rename, delete)
- [ ] Personnel assignment UI
- [ ] Conflict warnings when team overloaded
- [ ] Undo/redo for team ops

**Deliverable**: Full team management interface

### Phase 5: Statistics Dashboard (Days 13-14)
- [ ] Utilization % chart (Zod validation)
- [ ] Weeks committed + peak concurrent metrics
- [ ] Phase mix breakdown (planning/active/closeout)
- [ ] Date range filter (12m, 6m, 3m, all)
- [ ] Calendar heatmap

**Deliverable**: Real-time stats with date filtering

### Phase 6: Export (Days 15-16)
- [ ] A3 PDF layout design
- [ ] Vector rendering (avoid raster issues)
- [ ] User-selectable date range
- [ ] CSV export option

**Deliverable**: Downloadable PDF + CSV

### Phase 7: Polish (Days 17-20)
- [ ] Loading skeletons
- [ ] Error boundaries + recovery
- [ ] Keyboard shortcuts (⌘K palette)
- [ ] Responsive design (mobile + tablet)
- [ ] Performance optimizations

**Deliverable**: Production-ready UI

### Phase 8: Backend + Persistence (Days 21-25)
- [ ] Hono API routes (GET/POST /api/mps, /api/teams)
- [ ] In-memory data service → Drizzle ORM + SQLite
- [ ] JWT authentication (better-auth setup)
- [ ] API client error handling

**Deliverable**: Persistent, authenticated backend

---

## Key Helpers & Utilities

### Date Calculations (lib/dateUtils.ts)
```typescript
// Planning window: 14 weeks before start (MPs), 4 weeks (Log Visits)
// Closeout window: 2 weeks after end
// Week = Sunday-based (ISO 8601)

calculatePlanningStart(startDate: Date, mpType: 'In Water' | 'Docking' | 'Log Visit'): Date
calculateCloseoutEnd(endDate: Date): Date
getWeekNumber(date: Date): number
getAllWeeksInRange(start: Date, end: Date): Date[]
isWeekInRange(week: Date, start: Date, end: Date): boolean
```

### Gantt Collision Detection (lib/ganttUtils.ts)
```typescript
// Lane-based stacking: if two MPs overlap, place second bar below first
// Returns { bar1Lane, bar2Lane } to avoid collisions in same lane

calculateBarCollisions(mpBars: GanttBar[]): Map<string, number> // mpId → laneIndex
getMaxLanes(mps: MP[]): number  // Max concurrent MPs across all dates
```

### Validation (lib/validators.ts)
```typescript
// Zod schemas used by both client + server

mpSchema: z.object({
  id: z.string(),
  ship: z.string(),
  mpType: z.enum(['In Water', 'Docking', 'Log Visit']),
  startDate: z.string().date(),
  endDate: z.string().date(),
  // ...
})

teamSchema: z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  // ...
})
```

---

## Common Tasks

### Add a New Component
1. Create file in `src/components/{category}/ComponentName.tsx`
2. Import React + types from `src/types/index.ts`
3. Export as default
4. Use Tailwind for styling
5. Optionally extract custom hook to `src/hooks/useComponentName.ts`

### Add a New Store (Zustand)
1. Create file in `src/stores/featureStore.ts`
2. Define interface + initial state
3. Export `useFeatureStore = create<FeatureState>(...)`
4. Re-export from `src/stores/index.ts`
5. Use in components: `const items = useFeatureStore(s => s.items)`

### Add a New API Route (Hono)
1. Create file in `server/routes/feature.ts`
2. Define handler: `app.get('/api/feature', (c) => ...)`
3. Import in `server/index.ts` and attach to app
4. Use `lib/api.ts` client to call from React

### Add Validation (Zod)
1. Add schema to `lib/validators.ts`
2. Use in API endpoint: `const data = schema.parse(ctx.req.json())`
3. Use in React: `schema.safeParse(formData)` before submit
4. Share types: `type Feature = z.infer<typeof featureSchema>`

---

## Testing Checklist (Before Commit)

- [ ] Component renders without errors
- [ ] Zustand store persists state across re-renders
- [ ] API calls use `lib/api.ts` wrapper
- [ ] All data validated with Zod
- [ ] Tailwind classes applied (no inline styles)
- [ ] TypeScript strict mode passes (`npm run build`)
- [ ] No console errors in dev server
- [ ] Responsive on mobile (if UI-facing)

---

## Git Workflow

### Commit Messages
```
feat: add Gantt chart component
fix: collision detection for overlapping MPs
chore: update dependencies
docs: add Gantt phase calculations to comments
refactor: extract lane stacking logic to utils
```

### Branch Strategy
- `main`: Always deployable
- Feature branches: `feature/gantt-chart`, `fix/collision-detection`
- Always squash before merging: `git rebase -i origin/main`

---

## Environment Variables

Create `.env.local` (not committed):
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=MP Manager V2
```

Access in React: `import.meta.env.VITE_API_URL`

---

## Debugging

### Browser DevTools
- React DevTools: Inspect component props + state
- Network tab: Check API calls via `lib/api.ts`
- Console: All errors logged + timestamped

### Common Issues

**"Store not updating"**: Zustand requires state to be immutable. Use spread operator:
```typescript
// ❌ Wrong
state.items.push(newItem)

// ✅ Correct
set(s => ({ ...s, items: [...s.items, newItem] }))
```

**"API returns 404"**: Verify Hono route is registered in `server/index.ts` and path matches client call.

**"Styling not applied"**: Check Tailwind config includes `src/**/*.tsx` paths.

---

## Resources

- **React**: https://react.dev
- **Zustand**: https://github.com/pmndrs/zustand
- **Hono**: https://hono.dev
- **Tailwind**: https://tailwindcss.com
- **Zod**: https://zod.dev
- **TypeScript**: https://www.typescriptlang.org

---

## Code Review Checklist (for AI)

When adding new features:
1. ✅ Does it match the planned directory structure?
2. ✅ Does it use Zustand for shared state (no useState for global data)?
3. ✅ Does it validate with Zod before saving?
4. ✅ Does it use `lib/api.ts` for server calls?
5. ✅ Does it follow naming conventions?
6. ✅ Does it include TypeScript types?
7. ✅ Does it use Tailwind (no CSS files)?

---

## Help & Questions

If unsure:
1. Check the directory structure — where does this file belong?
2. Check existing patterns — how did we do this last time?
3. Read the phase plan — is this in scope right now?
4. Check shared types — are there interfaces already defined?

**Never**: Mix old MP Manager (v1) patterns with v2. Start fresh with this stack.
