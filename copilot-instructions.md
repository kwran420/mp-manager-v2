# MP Manager V2 — Copilot Development Instructions

**Version**: v0.1.0 | **Date**: 2026-01-17 | **Status**: Scaffolding Phase
MP_MANAGER_V2_PLAN.md has the full concept and should be referenced often so we dont lose our way
---

## Project Overview

**MP Manager V2** is a complete rewrite of the MP Manager application — a browser-based Gantt chart scheduling tool for managing maintenance periods (MPs) across multiple naval ships and teams.

**Stack**: React 18 + Hono + Tailwind CSS + Zustand + Drizzle ORM + SQLite (database-first, Unraid-ready)

**Core Goal**: Build an intuitive, real-time scheduling interface with Gantt visualization, team utilization metrics, and PDF export — with persistent SQLite backend from day 1, deployable immediately to Unraid.

---

## Current Status

✅ **Repository Created**: https://github.com/kwran420/mp-manager-v2
✅ **Architecture Decision**: Database-first (SQLite + Drizzle), Unraid-ready from day 1
✅ **Git Initialized**: First commit + `.gitignore` configured

⏳ **Next**: Add database dependencies (Drizzle ORM, better-sqlite3), build schema, then Phase 1

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

---

## Deployment & Infrastructure

### Docker Strategy

**Single-container approach**: Frontend (React) + Backend (Hono) in one Docker image, served on port 3000.

**Dockerfile** (multi-stage):
```dockerfile
# Stage 1: Build client
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
RUN mkdir -p /app/data /app/backups
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
```

**docker-compose.yml** (development):
```yaml
version: '3.8'
services:
  mp-manager:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
      - ./backups:/app/backups
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:/app/data/mp-manager.db
```

**Build & Run**:
```bash
docker build -t mp-manager:latest .
docker run -p 3000:3000 -v $(pwd)/data:/app/data mp-manager:latest
```

### Database Setup (SQLite-First Architecture)

**Persistent from Day 1**: SQLite via Drizzle ORM + better-sqlite3 (zero network overhead)
- **File**: `/app/data/mp-manager.db` (persisted to Docker volume)
- **Schema**: MPs, Teams, Personnel, Assignments, AuditLog
- **Zero External Deps**: No separate database server (embedded in Node process)
- **Azure-Compatible**: Portable; can migrate to PostgreSQL in future (Drizzle adapts)

**Database Tables** (implemented in Phase 1a):
```sql
ships (id, name, code, created_at)
mps (id, ship_id, mp_number, year, type, status, start_date, end_date, planning_start, closeout_end, has_pre_planning, created_at)
teams (id, name, created_at)
personnel (id, team_id, name, rank, role, created_at)
assignments (id, mp_id, team_id, weeks_allocated, status, created_at)
audit_log (id, action, entity_type, entity_id, user, timestamp)
```

**Unraid Deployment**: Docker handles setup — database directory mounted as volume for persistence across restarts.

**Environment Variables** (per stage):
```env
# Development
DATABASE_URL=file:./data/mp-manager.db
NODE_ENV=development
VITE_API_URL=http://localhost:3000

# Production (Unraid Docker)
DATABASE_URL=file:/app/data/mp-manager.db
NODE_ENV=production
APP_URL=https://mp.yourdomain.com
```

### Unraid Deployment

**Goal**: Self-hosted on Unraid with external access via Traefik reverse proxy.

**Steps** (Phase 8+):

1. **Push image to registry**:
   ```bash
   docker tag mp-manager:latest ghcr.io/your-username/mp-manager:latest
   docker push ghcr.io/your-username/mp-manager:latest
   ```

2. **Deploy on Unraid**:
   - Create container from `ghcr.io/your-username/mp-manager:latest`
   - Volumes: `/app/data` → `/mnt/user/mp-manager/data` (Unraid share)
   - Port: 3000 → 3000
   - Labels for Traefik (auto HTTPS, domain routing)

3. **Traefik configuration**:
   ```yaml
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.mp-manager.rule=Host(`mp.yourdomain.com`)"
     - "traefik.http.routers.mp-manager.tls.certresolver=letsencrypt"
     - "traefik.http.services.mp-manager.loadbalancer.server.port=3000"
   ```

4. **Data persistence**:
   - Unraid `/mnt/user/mp-manager/data` mapped to container `/app/data`
   - Automatic backups via Unraid's share backup feature
   - SQLite DB in `/app/data/mp-manager.db`

### Build Matrix

| Stage | Environment | Docker Image | Database | Auth |
|-------|-------------|--------------|----------|------|
| **Dev** | localhost:5173 + 3000 | None (npm run dev) | In-memory | None |
| **Staging** | Docker local | `mp-manager:dev` | SQLite file | None |
| **Production** | Unraid Traefik | `ghcr.io/.../mp-manager:latest` | SQLite file | better-auth |

### Production Checklist

Before deploying to Unraid:
- [ ] `npm run build` passes (TypeScript strict mode)
- [ ] `docker build .` succeeds
- [ ] All env vars documented in `.env.example`
- [ ] Database schema migrated (if applicable)
- [ ] CORS configured for production domain
- [ ] JWT secrets generated (Phase 3+)
- [ ] Error logging configured
- [ ] Backups strategy documented

---

## Code Organization Rules

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

### Phase 1a: Database + Schema (Days 1-2)
- [ ] Create `server/db/db.ts` — SQLite initialization with Drizzle ORM
- [ ] Define Drizzle schema (ships, mps, teams, personnel, assignments, auditLog)
- [ ] Create database migrations strategy (auto-init on first run)
- [ ] Add database seeding for test data (sample ships, teams, MPs)
- [ ] Create `server/db/queries.ts` — Type-safe query builders

**Deliverable**: Persistent SQLite database with Drizzle schema, auto-initialized

### Phase 1b: Core UI Shell (Days 2-3)
- [ ] Dark mode toggle + Tailwind setup
- [ ] Header, Sidebar, MainLayout
- [ ] Basic routing (Dashboard, Teams, Settings pages)
- [ ] Connect Zustand stores to database queries

**Deliverable**: Clickable shell connected to database backend

### Phase 2: Server API Routes (Days 4-5)
- [ ] Hono API routes: GET/POST `/api/mps`, `/api/teams`
- [ ] Database persistence (Drizzle ORM queries)
- [ ] Error handling + validation (Zod schemas)
- [ ] API client abstraction in `src/lib/api.ts`

**Deliverable**: Frontend talking to persistent backend

### Phase 3: Gantt Chart Core (Days 6-10) ⭐
- [ ] GanttTimeline: Week/month headers
- [ ] GanttLane: Team rows with styling
- [ ] GanttBar: Single MP bar component
- [ ] Collision detection + lane stacking algorithm
- [ ] Click-to-edit modal integration
- [ ] Scroll + zoom controls

**Deliverable**: Functional Gantt view with draggable bars
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

### Phase 8: Authentication (Days 21-25)
- [ ] JWT token generation and validation
- [ ] better-auth setup (email + password auth)
- [ ] Login/register/forgot-password flows
- [ ] Role-based access control (admin/viewer)
- [ ] Session management

**Deliverable**: Authenticated, multi-user application

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
