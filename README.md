# iiskills-in

**Skilling India** — Turborepo monorepo powering [iiskills.in](https://iiskills.in).

2,400 lessons across 8 disciplines plus a standalone Aptitude app, all deployed as
independent Next.js 15 apps on `*.iiskills.in` subdomains.

---

## Port Map — Clean 10 Apps

| App | Subdomain | Port |
|-----|-----------|------|
| `apps/main` | `iiskills.in` | **3000** |
| `apps/learn-ai` | `learn-ai.iiskills.in` | **3002** |
| `apps/learn-chemistry` | `learn-chemistry.iiskills.in` | **3005** |
| `apps/learn-developer` | `learn-developer.iiskills.in` | **3006** |
| `apps/learn-geography` | `learn-geography.iiskills.in` | **3007** |
| `apps/learn-management` | `learn-management.iiskills.in` | **3008** |
| `apps/learn-math` | `learn-math.iiskills.in` | **3009** |
| `apps/learn-physics` | `learn-physics.iiskills.in` | **3010** |
| `apps/learn-pr` | `learn-pr.iiskills.in` | **3011** |
| `apps/learn-apt` *(standalone)* | `learn-apt.iiskills.in` | **3012** |
| `apps/web` *(admin only)* | `admin.iiskills.in` | **3040** |

> **Excluded from clean apps:** process 0 (logrotate) and any legacy "copy" apps.
> Keep the old `iiskills.cloud` Nginx config in `sites-available/` but **do not** symlink
> it to `sites-enabled/` — prevents port 80/443 collisions.

---

## Architecture

```
apps/
├── main/             iiskills.in          :3000  Landing page + 9-course grid
├── learn-ai/         learn-ai.iiskills.in :3002  300 lessons
├── learn-chemistry/                       :3005  300 lessons
├── learn-developer/                       :3006  300 lessons
├── learn-geography/                       :3007  300 lessons
├── learn-management/                      :3008  300 lessons
├── learn-math/                            :3009  300 lessons
├── learn-physics/                         :3010  300 lessons
├── learn-pr/                              :3011  300 lessons
├── learn-apt/        learn-apt.iiskills.in:3012  Standalone aptitude app
└── web/              admin.iiskills.in    :3040  Admin content manager

packages/
├── access/    AccessGuard, useAccess, AccessProvider — single paywall source of truth
├── content/   getLessonsByCourse, getAllCourses — 2,400-lesson JSON
├── hooks/     UserProvider, useUser
└── ui/        LessonViewer, PaywallUI, CourseCard — shared React components
```

---

## Quick Start

```bash
# 1. Copy env template and fill in Supabase keys
cp .env.example .env.local

# 2. Install (Yarn 4 via Corepack)
corepack enable
yarn install

# 3. Build all apps
yarn build

# 4. Start a specific app
cd apps/main && yarn start          # http://localhost:3000
cd apps/learn-ai && yarn start      # http://localhost:3002
cd apps/learn-apt && yarn start     # http://localhost:3012
cd apps/web && yarn start           # http://localhost:3040 (admin)
```

---

## Supabase — Schema Reset & 2,400-Lesson Sync

### Step 1 — SQL wipe (run in Supabase SQL Editor)

```sql
-- Drop legacy tables that contain paywall/pricing DNA
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Recreate clean, logic-only tables for iiskills.in
CREATE TABLE courses (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT
);

CREATE TABLE lessons (
  id              SERIAL PRIMARY KEY,
  course_id       TEXT REFERENCES courses(id),
  module_number   INTEGER,
  lesson_number   INTEGER,
  title           TEXT NOT NULL,
  content         TEXT,  -- Markdown format
  video_url       TEXT
);

-- Unique constraint enables safe upserts
ALTER TABLE lessons
  ADD CONSTRAINT lessons_course_module_lesson_unique
  UNIQUE (course_id, module_number, lesson_number);
```

### Step 2 — Seed 2,400 lessons (coming: `scripts/sync-lessons.ts`)

```bash
# Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
yarn db:sync
```

---

## Production Deployment

```bash
# Build everything
yarn build

# PM2 — start all 10 clean apps
pm2 start apps/main/.next/standalone/server.js   --name main        -- --port 3000
pm2 start apps/learn-ai/.next/standalone/server.js --name learn-ai  -- --port 3002
pm2 start apps/learn-chemistry/.next/standalone/server.js --name learn-chemistry -- --port 3005
pm2 start apps/learn-developer/.next/standalone/server.js --name learn-developer -- --port 3006
pm2 start apps/learn-geography/.next/standalone/server.js --name learn-geography -- --port 3007
pm2 start apps/learn-management/.next/standalone/server.js --name learn-management -- --port 3008
pm2 start apps/learn-math/.next/standalone/server.js --name learn-math -- --port 3009
pm2 start apps/learn-physics/.next/standalone/server.js --name learn-physics -- --port 3010
pm2 start apps/learn-pr/.next/standalone/server.js --name learn-pr -- --port 3011
pm2 start apps/learn-apt/.next/standalone/server.js --name learn-apt -- --port 3012
pm2 start apps/web/.next/standalone/server.js --name admin -- --port 3040
```

## Nginx

```bash
# Enable
ln -s /etc/nginx/sites-available/iiskills.in /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Disable legacy cloud config (prevent port collisions)
# Do NOT symlink iiskills.cloud to sites-enabled
```

## License

See [LICENSE](./LICENSE).
