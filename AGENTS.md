# AGENTS.md - Digital Bulletin Board Implementation Guide

## Build/Test Commands
- Build: `pnpm run build` (compiles TypeScript to `dist/`)
- Start: `pnpm run start` (builds then runs)
- No tests configured yet - add when implementing features

## Tech Stack
- Backend: Express.js (v5.1) + TypeScript (strict mode)
- Database: MS SQL Server Express via `mssql` package
- Package Manager: pnpm@10.19.0
- Output: CommonJS to `dist/`

## Code Style & Structure

### File Organization (One Responsibility Per File)
- `src/db.ts`: Database connection pool and query utilities ONLY
- `src/env.ts`: Environment variable validation and exports ONLY
- `src/index.ts`: Express app setup and route handlers ONLY
- Routes: Create `src/routes/` for announcement, auth, comment routes (one file per resource)
- Controllers: Create `src/controllers/` for business logic (one file per resource)
- Models: Create `src/models/` for type definitions (User, Announcement, Comment, Like, Subscription)
- Middleware: Create `src/middleware/` for auth, validation, error handling

### Imports & Formatting
- Use named imports: `import { connect, ConnectionPool } from 'mssql'`
- Import order: external packages → local modules (db, env) → types
- Use single quotes for strings, double quotes only when necessary
- No semicolons optional - current code uses semicolons, maintain consistency

### TypeScript & Types
- Strict mode enabled - all types must be explicit
- Define interfaces for all entities (User, Announcement, Comment, Like, Subscription)
- No `any` types except in generic `querySql` return (refine this with proper types)
- Use `async/await` for all async operations
- Return types: always specify for public functions

### Naming Conventions
- Files: lowercase with hyphens (e.g., `announcement-routes.ts`, `auth-controller.ts`)
- Functions: camelCase (`initDb`, `querySql`, `isConnected`)
- Interfaces/Types: PascalCase (`DatabaseEnv`, `User`, `Announcement`)
- Constants: SCREAMING_SNAKE_CASE for env vars (`DB_USER`, `DB_PASSWORD`)
- Database: snake_case for tables/columns (`user_id`, `announcement_id`, `created_at`)

### Error Handling
- Use try/catch for async operations
- Log errors with `console.error`, info with `console.info`
- Return proper HTTP status codes: 400 (bad request), 500 (server error), 503 (service unavailable)
- Always return JSON responses: `res.json({ error: string })` or `res.json({ rows/data })`
- Validate input before processing - check types and required fields

### Database Patterns
- Use connection pool from `db.ts` - call `initDb()` once at startup
- Check `isConnected()` before queries
- Use parameterized queries to prevent SQL injection (NOT raw string concatenation)
- Create typed query helpers: `getUserById(id: number)`, `createAnnouncement(data: AnnouncementInput)`

### API Structure (RESTful)
- POST `/api/auth/login` - authenticate user
- POST `/api/auth/register` - create new user
- GET `/api/announcements` - list all announcements
- POST `/api/announcements` - create announcement (faculty only)
- GET `/api/announcements/:id` - get single announcement
- PUT `/api/announcements/:id` - update announcement (faculty only)
- DELETE `/api/announcements/:id` - delete announcement (faculty only)
- POST `/api/announcements/:id/like` - toggle like
- POST `/api/announcements/:id/comments` - add comment
- GET `/api/announcements/:id/comments` - get comments
- POST `/api/subscriptions` - enable/disable notifications

### Frontend Structure (to be implemented)
- `public/` directory for static HTML/CSS files
- Serve static files via `express.static('public')`
- Use CSS classes: `btn-primary`, `badge-outline`, `card`, `card-footer`
- Mobile-first responsive design

## Implementation Priorities
1. Database schema & migrations (User, Announcement, Like, Comment, Subscription tables)
2. Authentication system (bcrypt for passwords, sessions/JWT)
3. CRUD routes for announcements (faculty role check)
4. Like/comment functionality
5. Notification system (browser notifications + `/notifications` page)
6. Frontend HTML/CSS pages

## Key Principles
- One file = one responsibility (no mixing routes + controllers + models)
- Type everything explicitly (strict TypeScript)
- Validate all inputs before database operations
- Use parameterized queries (SQL injection prevention)
- Faculty vs Student role checks on protected routes
- Consistent error handling and logging
