# MP Manager V2 — Full Rewrite Startup Plan
MP_MANAGER_V2_PLAN.md has the full concept and should be referenced often so we dont lose our way
A complete rebuild using the modern stack, self-hosted on Unraid with Docker, designed for 15 users with external access.

---

## The Complete Stack

| Layer | Choice | Package |
|-------|--------|---------|
| **Framework** | React 18 | `react`, `react-dom` |
| **Build** | Vite | `vite` |
| **Components** | shadcn/ui | CLI install |
| **Styling** | Tailwind CSS v4 | `tailwindcss` |
| **Animations** | Framer Motion | `framer-motion` |
| **State** | Zustand | `zustand` |
| **Charts** | Tremor | `@tremor/react` |
| **⌘K Palette** | cmdk | `cmdk` |
| **Toasts** | Sonner | `sonner` |
| **Icons** | Lucide | `lucide-react` |
| **Forms** | React Hook Form + Zod | `react-hook-form`, `zod` |
| **Data Tables** | TanStack Table | `@tanstack/react-table` |
| **Dates** | date-fns | `date-fns` |
| **PDF Export** | @react-pdf/renderer | `@react-pdf/renderer` |
| **Backend** | Node.js + Hono | `hono` (ultrafast, tiny) |
| **ORM** | Drizzle | `drizzle-orm` |
| **Database** | SQLite | `better-sqlite3` |
| **Auth** | better-auth | `better-auth` (magic links → passkeys) |
| **Validation** | Zod | `zod` (shared front/back) |

---

## Why This Backend Choice

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Keep .NET | Already exists | Different language, Cosmos baggage | ❌ |
| Node + Express | Familiar | Verbose, slow | ❌ |
| Node + Hono | Ultrafast, tiny, edge-ready | Newer | ✅ |
| Go | Single binary | Different language | ❌ |
| tRPC | Type-safe | Complex setup | ⚠️ Later |

**Hono** is 10x faster than Express, works in Docker, and pairs perfectly with React for a full TypeScript stack.

---

## Project Structure

```
mp-manager-v2/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
│
├── src/
│   ├── main.tsx                    # React entry
│   ├── App.tsx                     # Router + providers
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── command.tsx         # ⌘K palette
│   │   │   ├── toast.tsx           # Sonner
│   │   │   └── ...
│   │   │
│   │   ├── gantt/
│   │   │   ├── GanttChart.tsx      # Main Gantt view
│   │   │   ├── GanttBar.tsx        # Draggable MP bar
│   │   │   ├── GanttTimeline.tsx   # Week/month headers
│   │   │   └── GanttLane.tsx       # Team row
│   │   │
│   │   ├── stats/
│   │   │   ├── StatsPanel.tsx
│   │   │   ├── UtilizationChart.tsx
│   │   │   └── TeamHeatmap.tsx
│   │   │
│   │   ├── apl/
│   │   │   ├── AplModal.tsx
│   │   │   └── AplExport.tsx
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── CommandPalette.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx           # Main Gantt view
│   │   ├── Teams.tsx               # Team management
│   │   ├── Settings.tsx            # User preferences
│   │   └── Login.tsx               # Auth page
│   │
│   ├── stores/
│   │   ├── mpStore.ts              # Zustand: MPs state
│   │   ├── teamStore.ts            # Zustand: Teams state
│   │   └── uiStore.ts              # Zustand: UI state (dark mode, etc)
│   │
│   ├── hooks/
│   │   ├── useMPs.ts               # Data fetching hook
│   │   ├── useAuth.ts              # Auth state
│   │   └── useKeyboard.ts          # Keyboard shortcuts
│   │
│   ├── lib/
│   │   ├── api.ts                  # API client
│   │   ├── utils.ts                # Helpers
│   │   └── pdf.tsx                 # PDF generation
│   │
│   └── styles/
│       └── globals.css             # Tailwind base
│
├── server/
│   ├── index.ts                    # Hono entry
│   ├── routes/
│   │   ├── auth.ts                 # Auth endpoints
│   │   ├── mps.ts                  # MP CRUD
│   │   ├── teams.ts                # Team CRUD
│   │   └── export.ts               # PDF/CSV export
│   │
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema
│   │   ├── migrations/             # SQL migrations
│   │   └── index.ts                # DB connection
│   │
│   └── services/
│       ├── email.ts                # Magic link emails
│       └── pdf.ts                  # Server-side PDF (optional)
│
├── shared/
│   ├── types.ts                    # Shared TypeScript types
│   └── validation.ts               # Zod schemas (front + back)
│
└── data/
    └── mp-manager.db               # SQLite file (Docker volume)
```

---

## Database Schema (Drizzle + SQLite)

```typescript
// server/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role', { enum: ['admin', 'viewer'] }).default('viewer'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

export const mps = sqliteTable('mps', {
  id: text('id').primaryKey(),           // "SCH_01_26"
  ship: text('ship').notNull(),           // "Cape Schanck"
  mpType: text('mp_type', { enum: ['In Water', 'Docking', 'Log Visit'] }),
  startDate: text('start_date').notNull(), // ISO date
  endDate: text('end_date').notNull(),
  location: text('location'),
  hasPrePlanning: integer('has_pre_planning', { mode: 'boolean' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const personnel = sqliteTable('personnel', {
  id: text('id').primaryKey(),
  teamId: text('team_id').references(() => teams.id),
  name: text('name').notNull(),
  role: text('role'),
});

export const assignments = sqliteTable('assignments', {
  id: text('id').primaryKey(),
  mpId: text('mp_id').references(() => mps.id),
  teamId: text('team_id').references(() => teams.id),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});
```

---

## Docker Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  mp-manager:
    build: .
    container_name: mp-manager
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data          # SQLite persistence
      - ./backups:/app/backups    # Backup directory
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/mp-manager.db
      - AUTH_SECRET=${AUTH_SECRET}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - APP_URL=https://mp.yourdomain.com
    labels:
      # Traefik labels for Unraid reverse proxy
      - "traefik.enable=true"
      - "traefik.http.routers.mp-manager.rule=Host(`mp.yourdomain.com`)"
      - "traefik.http.routers.mp-manager.tls.certresolver=letsencrypt"
```

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create data directory
RUN mkdir -p /app/data /app/backups

EXPOSE 3000
CMD ["node", "dist/server/index.js"]
```

---

## Auth Strategy (Phased)

### Phase 1: Magic Links (Start Here)

```typescript
// Using better-auth library
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';

export const auth = betterAuth({
  database: db,
  emailAndPassword: { enabled: false },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: 'Sign in to MP Manager',
          html: `<a href="${url}">Click to sign in</a>`
        });
      }
    })
  ]
});
```

**User flow:** Enter email → Check inbox → Click link → Logged in for 30 days

### Phase 2: Add Passkeys (Later Enhancement)

```typescript
import { passkey } from 'better-auth/plugins';

export const auth = betterAuth({
  plugins: [
    magicLink({ ... }),
    passkey({
      rpId: 'mp.yourdomain.com',
      rpName: 'MP Manager'
    })
  ]
});
```

**User flow:** Click "Add Passkey" → Biometric prompt → Future logins = Face ID / fingerprint

---

## Implementation Phases

### Phase 0: Project Setup (Day 1)
- [ ] Initialize Vite + React + TypeScript
- [ ] Install and configure Tailwind CSS v4
- [ ] Run shadcn/ui init, add base components
- [ ] Set up Hono backend with basic health endpoint
- [ ] Configure Drizzle + SQLite
- [ ] Create docker-compose.yml
- [ ] Test local Docker build

### Phase 1: Core Shell (Days 2-3)
- [ ] Build layout: Header, Sidebar, main content area
- [ ] Implement dark mode toggle (Zustand + Tailwind)
- [ ] Add ⌘K command palette (cmdk)
- [ ] Configure Sonner toasts
- [ ] Set up React Router (Dashboard, Teams, Settings pages)
- [ ] Add keyboard shortcut system

### Phase 2: Authentication (Days 4-5)
- [ ] Set up better-auth with magic links
- [ ] Build Login page with shadcn forms
- [ ] Add protected route wrapper
- [ ] Configure SMTP for magic link emails
- [ ] Add session management (30-day remember)
- [ ] Role-based UI (admin vs viewer)

### Phase 3: Data Layer (Days 6-7)
- [ ] Define Zod schemas (shared validation)
- [ ] Build API routes: GET/POST /api/mps, /api/teams
- [ ] Create Zustand stores with API sync
- [ ] Add optimistic updates with rollback
- [ ] Implement undo/redo system
- [ ] Migrate existing JSON data to SQLite

### Phase 4: Gantt Chart (Days 8-12) ⭐ Critical
- [ ] Build GanttTimeline (week/month headers)
- [ ] Build GanttLane (team rows)
- [ ] Build GanttBar with phase coloring
- [ ] Add zoom controls (0.5x - 2x)
- [ ] Implement click-to-edit modal
- [ ] Add countdown/elapsed badges
- [ ] Auto-scroll to today
- [ ] Lane stacking for overlaps
- [ ] Smooth animations with Framer Motion

### Phase 5: Team Management (Days 13-14)
- [ ] Team list with add/edit/delete
- [ ] Personnel assignment
- [ ] Drag-drop reordering
- [ ] Assignment modal for MPs

### Phase 6: Statistics Dashboard (Days 15-16)
- [ ] Utilization % per team (Tremor charts)
- [ ] Weeks committed / peak concurrent
- [ ] Phase mix breakdown
- [ ] Date range filter
- [ ] Calendar heatmap

### Phase 7: APL Generation (Days 17-18)
- [ ] APL modal with calculated dates
- [ ] Inline editing for actions/accountables
- [ ] CSV export
- [ ] PDF export with @react-pdf/renderer

### Phase 8: PDF Gantt Export (Days 19-20)
- [ ] A3 landscape layout
- [ ] Vector rendering (sharp text)
- [ ] Phase colors and legends
- [ ] User-selectable date range

### Phase 9: Polish & Deploy (Days 21-25)
- [ ] Loading skeletons everywhere
- [ ] Error boundaries with recovery
- [ ] Staggered list animations
- [ ] Keyboard shortcut overlay (`?`)
- [ ] Right-click context menus
- [ ] Production Docker build
- [ ] Unraid deployment + Traefik HTTPS
- [ ] Backup cron job (SQLite → Unraid share)
- [ ] Final testing with team

### Phase 10: Passkey Enhancement (Future)
- [ ] Add passkey registration flow
- [ ] Biometric login option
- [ ] Device management UI

---

## Timeline Summary

| Phase | Duration | Milestone |
|-------|----------|-----------|
| Setup + Shell | 3 days | App loads, dark mode, ⌘K works |
| Auth | 2 days | Can log in via magic link |
| Data Layer | 2 days | CRUD works, data persists |
| Gantt Chart | 5 days | Core scheduling view complete |
| Teams + Stats | 4 days | Full team management |
| APL + Export | 4 days | Document generation works |
| Polish + Deploy | 5 days | Production-ready on Unraid |
| **Total** | **~25 days** | **~5 weeks** |

---

## Migration Path

1. **Export current data** from Cosmos/JSON
2. **Import into SQLite** via migration script
3. **Parallel run** old + new for validation
4. **Cutover** when confident

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | SQLite | 15 users, 50KB data, trivial backups |
| Backend | Hono | Fast, tiny, TypeScript, Docker-friendly |
| Auth | Magic links → Passkeys | Modern UX, no passwords |
| Frontend | React + shadcn/ui | Best ecosystem, Linear-quality possible |
| Hosting | Docker on Unraid | Self-hosted, external access via Traefik |

---

## Deployment Portability

The stack is designed to be **environment-agnostic** — same codebase, same Docker image, same SQLite file.

### What Works Everywhere

| Component | Unraid | Azure Container Apps | Any Docker Host |
|-----------|--------|---------------------|-----------------|
| **Frontend** | Same Docker image | Same Docker image | Same Docker image |
| **Backend (Hono)** | Same code | Same code | Same code |
| **Database (SQLite)** | Local volume | Azure Files mount | Any volume |
| **Auth (better-auth)** | Same config | Same config | Same config |

### What Changes Between Environments

Only **environment variables**:

```bash
# Unraid
APP_URL=https://mp.yourdomain.com
DATABASE_URL=file:/app/data/mp-manager.db
SMTP_HOST=smtp.mailgun.org

# Azure Container Apps
APP_URL=https://mp-manager.azurecontainerapps.io
DATABASE_URL=file:/app/data/mp-manager.db  # Same!
SMTP_HOST=smtp.mailgun.org                  # Same!
```

### Azure Hosting Option

| Service | Cost | Complexity | Notes |
|---------|------|------------|-------|
| **Azure Container Apps** | ~$5-15/mo | Low | ✅ Recommended |
| **Azure App Service** | ~$13-55/mo | Low | More features |
| **Azure Container Instances** | ~$3-10/mo | Very Low | Simple containers |

**Database on Azure**: SQLite on Azure Files (~$1-2/mo) — same file, same queries.

### Future Upgrade Paths

| If You Want... | Change Required |
|----------------|-----------------|
| **Move Unraid → Azure** | Push same image, mount Azure Files, update DNS |
| **Move Azure → Unraid** | Pull image, copy SQLite file, done |
| **Scale to 1000 users** | Swap SQLite → Turso (one line change) |
| **Add Passkeys** | Add plugin to existing better-auth config |
| **Add real-time sync** | Add WebSocket to Hono (same server) |
| **Switch to Postgres** | Change Drizzle adapter + connection string |

### Migration Examples

**Unraid → Azure (15 minutes)**
```bash
# 1. Push image to registry
docker push ghcr.io/you/mp-manager:latest

# 2. Copy SQLite to Azure Files
az storage file upload --source ./data/mp-manager.db ...

# 3. Deploy container
az containerapp up --image ghcr.io/you/mp-manager:latest

# 4. Update DNS
```

**SQLite → Turso (distributed SQLite)**
```typescript
// Before (local SQLite)
import Database from 'better-sqlite3';
const db = new Database('/app/data/mp-manager.db');

// After (Turso - same queries!)
import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_URL });
```

---

## Open Items

- [ ] Domain name for external access
- [ ] SMTP provider for magic links (Mailgun/SendGrid/Resend)
- [ ] Backup retention policy
- [ ] Unraid reverse proxy setup (Traefik vs Nginx Proxy Manager)
