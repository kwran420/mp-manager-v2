# MP Manager V2 — GitHub Push Instructions

Environment is ready. Dependencies installed, git initialized, and first commit created locally.

## Next: Create GitHub Repository

1. **Go to GitHub** (https://github.com/new)
2. **Create new repo** named `mp-manager-v2`
   - Owner: Your account
   - Description: "React + Hono scheduling app for naval maintenance"
   - Public or Private (your choice)
   - Do NOT initialize with README, .gitignore, or license
3. **Click Create repository**

## Then: Push to GitHub

Copy and run these commands in PowerShell (in the `mp-manager-v2` folder):

```powershell
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/mp-manager-v2.git
git push -u origin main
```

Replace `<YOUR-USERNAME>` with your actual GitHub username.

## Verify

Visit `https://github.com/<YOUR-USERNAME>/mp-manager-v2` — you should see all files pushed.

## Development Workflow

**Start dev server:**
```powershell
npm run dev
```
App runs at http://localhost:5173

**Build for production:**
```powershell
npm run build
npm run start
```
App runs at http://localhost:3000

## Current Stack (Simplified, MVP-Ready)

✅ **React 18** + Vite (fast HMR)
✅ **Tailwind CSS** (styling)
✅ **Hono** (backend framework)
✅ **Zustand** (state management)
✅ **Zod** (validation)
✅ **Chart.js** (charts/stats)
✅ **Framer Motion** (animations)

**Deferred (add later):**
- better-auth (auth layer)
- Drizzle ORM + SQL database
- @react-pdf/renderer (PDF export)
- @tanstack/react-table (advanced tables)

These will be added after core Gantt + scheduling features are working.
