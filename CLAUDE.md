# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**우리말젠 (Urimalzen)** - A Korean-Mongolian language learning web application for Mongolians learning Korean. Features vocabulary learning with KIIP (Korea Immigration & Integration Program) integration, pronunciation analysis, category-based learning, voice recording, progress tracking, and multi-level ranking system.

**Stack**: Full-stack TypeScript application with React 19 frontend and Express 5 backend.

**Developer**: 김영훈 Manager (Kim Young-hoon Manager)

**Project Evolution**: Originally a simple 9-flower vocabulary app, evolved into a comprehensive KIIP-based Korean learning platform with full curriculum support, pronunciation analysis, admin dashboard, and multi-level ranking system. Recent major features include TTS/STT integration and complete admin CRUD operations.

## Repository Structure

```
urimalzen/
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Route pages
│   │   ├── store/             # Zustand state stores
│   │   ├── services/          # API client (api.ts)
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Utilities (translations.ts)
│   │   └── App.tsx            # Main app with routing
│   ├── public/                # Static assets
│   └── .env                   # Environment config (in repo)
│
├── backend/                    # Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & file upload
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Seed scripts
│   │   └── index.ts           # Server entry point
│   ├── uploads/               # User-uploaded files (audio)
│   └── .env                   # Environment config (NOT in repo)
│
└── requirements/               # Requirements documentation
    └── screen/                # UI screenshots
```

## Quick Start

**First-time setup** from scratch:

```bash
# 1. Start MongoDB
docker run -d -p 27017:27017 --name urimalzen-mongodb mongo:latest

# 2. Setup Backend
cd backend
npm install
# Create .env file (see Environment Configuration section)
npm run seed:all              # Seeds admin user + all data
npm run dev                   # Starts on http://localhost:5000

# 3. Setup Frontend (in new terminal)
cd frontend
npm install
# Verify .env has correct VITE_API_URL
npm run dev                   # Starts on http://localhost:5173
```

**Access**:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Admin login: `admin@urimalzen.com` / `admin123!@#`

## Common Development Commands

### Backend (Express + TypeScript + MongoDB)

```bash
cd backend

# Development
npm run dev                    # Start with hot-reload (nodemon + ts-node)
npm run build                  # Compile TypeScript to dist/
npm start                      # Run compiled code (production)

# Database seeding (first-time setup)
npm run seed:admin             # Create admin user (admin@urimalzen.com / admin123!@#)
npm run seed:categories        # Seed 14 KIIP categories
npm run seed:phoneme-rules     # Seed Korean phoneme rules
npm run migrate:flowers        # Migrate flower words to new schema
npm run seed:kiip-words        # Seed KIIP vocabulary
npm run seed:all               # Run all seeders in order (includes admin)

# Individual seed scripts
npm run seed                   # Seed initial 9 flower words (deprecated - use migrate:flowers)
npm run seed:basic-words       # Seed basic vocabulary
npm run seed:advanced-words    # Seed advanced vocabulary
```

**Server**: `http://localhost:5000` (configured for external access via `0.0.0.0`)

**Prerequisites**:
- MongoDB running on `localhost:27017` or via Docker
- Check MongoDB with: `docker ps --filter "name=mongo"`
- Create `.env` file (not in repository) - see Environment Configuration section below

### Frontend (React + Vite + TypeScript)

```bash
cd frontend

# Development
npm run dev              # Start dev server with HMR
npm run build            # TypeScript compile + Vite build
npm run preview          # Preview production build
npm run lint             # ESLint
```

**Server**: `http://localhost:5173` (configured for external access via `0.0.0.0`)

## Backend Architecture

**Pattern**: MVC with Mongoose ODM and TypeScript strict mode

### Core Data Models

**Word Model** - Comprehensive vocabulary data with KIIP integration:
- Basic fields: `koreanWord`, `mongolianWord`, `pronunciation`, `imageUrl`, `description`
- KIIP/CEFR levels: `level.kiip` (0-5), `level.cefr` (A1-C2)
- 14-category system: `mainCategory`, `subCategory`
- Pronunciation: `phonemeRules[]`, `standardPronunciation`
- Vocabulary relationships: `synonyms[]`, `antonyms[]`, `collocations[]`, `relatedWords[]`
- Learning metadata: `wordType`, `formalityLevel`, `difficultyScore`, `frequencyRank`
- Examples array with Korean-Mongolian pairs
- Indexes on: `order`, `category`, `level.kiip`, `mainCategory`

**Unit Model** - KIIP curriculum organization:
- Structure: `unitNumber`, `title`, `titleMn`, `kiipLevel` (0-5)
- Contains: `lessons[]` array with `lessonNumber`, `title`, `wordIds[]`, `isReview`
- Challenge system: `challenge.wordIds[]`, `challenge.passingScore`
- Nested schemas: `lessonSchema`, `challengeSchema` (both with `_id: false`)

**Category Model** - 14 major KIIP categories:
- Multi-language: `name`, `nameEn`, `nameMn`
- Visual: `icon`, `color`, `order` (1-14)
- Structure: `subCategories[]` array
- Indexed on: `order`, `name`

**PhonemeRule Model** - Korean pronunciation rules:
- Multi-language: `ruleName`, `ruleNameEn`, `ruleNameMn`
- Examples array with: `word`, `written`, `pronounced`, `writtenMn`, `pronouncedMn`
- Metadata: `pattern`, `kiipLevel`, `order`

**User Model** - Authentication and profile:
- Auth: `email`, `password` (bcrypt hashed), `username`
- Levels: `level` (CEFR + KIIP)
- Location: `region`, `country`
- Stats: `totalScore`, `isAdmin`
- Pre-save hook for password hashing (salt rounds: 10)
- Method: `comparePassword(candidatePassword)`

**UserProgress Model** - Learning tracking per word/user:
- References: `userId`, `wordId`
- Metrics: `completed`, `score`, `attempts`

**Recording Model** - Audio pronunciation practice:
- References: `userId`, `wordId`
- File metadata: `audioUrl`, `duration`, `fileSize`

**Ranking Model** - Leaderboard system:
- Per-user document with `userId`, `rank`
- Scores organized by level

### Controller Patterns

**Critical patterns** for all controllers:

1. **Type signature**: `async (req: Request | AuthRequest, res: Response): Promise<void>`
2. **Response pattern**: ALWAYS `return` after `res.status().json()` (Express 5 requirement)
3. **Error handling**: Try-catch blocks with console.error logging
4. **AuthRequest**: Extended Request interface with `user` property (from middleware)

Example:
```typescript
export const someController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Logic here
    res.status(200).json({ success: true, data: result });
    return; // REQUIRED for TypeScript Promise<void>
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};
```

### Middleware & Authentication

**Authentication flow**:
1. JWT tokens in `Authorization: Bearer <token>` header
2. `authenticate` middleware extracts token, verifies, attaches `user` to `req.user`
3. `requireAdmin` middleware checks `req.user.isAdmin`

**File uploads**:
- Multer saves to `backend/uploads/` directory
- Served statically via `/uploads` route
- Audio recordings in WebM format

### API Routes Structure

All routes prefixed with `/api`:

```
/api/auth          - Authentication (register, login, profile)
/api/words         - Vocabulary CRUD + filtering by level/category
/api/categories    - 14 KIIP categories
/api/pronunciation - Phoneme rules and pronunciation analysis
/api/units         - KIIP curriculum units and lessons
/api/recordings    - Audio recording upload/retrieval
/api/progress      - User learning progress tracking
/api/rankings      - Leaderboards (global/country/region)
/api/admin         - Admin-only operations (all require authenticate + requireAdmin)
```

**Admin routes** (all require both `authenticate` and `requireAdmin`):
- Dashboard stats, user management, word CRUD, recording management

## Frontend Architecture

**Pattern**: React 19 with Zustand state management and React Router v7

### Routing Structure

Protected routes using `isAuthenticated` check:
- `/login` - User login
- `/` and `/learning` - Main learning interface (original 9 flowers)
- `/categories` - Browse 14 KIIP categories
- `/levels` - KIIP level selection (0-5)
- `/pronunciation` - Phoneme rules and pronunciation practice
- `/units` - KIIP curriculum units and lessons
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Admin panel

All user routes redirect to `/login` if not authenticated.

### State Management (Zustand)

**Six main stores** with persist middleware:

1. **useAuthStore** - Authentication state:
   - State: `user`, `token`, `isAuthenticated`
   - Persists to localStorage
   - Actions: `login`, `logout`, `setUser`

2. **useLearningStore** - Original flower learning:
   - Word list, current word, progress
   - Used by `/learning` route

3. **useCategoryStore** - KIIP category browsing:
   - Categories, selected category, words by category
   - Used by `/categories` route

4. **usePronunciationStore** - Pronunciation rules:
   - Phoneme rules, examples, analysis
   - Used by `/pronunciation` route

5. **useUnitStore** - KIIP curriculum:
   - Units, lessons, current unit/lesson
   - Used by `/units` and `/levels` routes

6. **useLanguageStore** - UI language switching:
   - State: `language` (type: `'ko' | 'mn'`)
   - Action: `setLanguage(lang)`
   - Does NOT persist (defaults to 'ko' on refresh)
   - Used by Header and other UI components for translation display

**Pattern**:
```typescript
export const useStore = create<State>()(
  persist(
    (set) => ({
      // state and actions
    }),
    { name: 'storage-key' }
  )
);
```

### Translation System (i18n)

**Location**: `frontend/src/utils/translations.ts`

**Structure**: Object-based translations with Korean (`ko`) and Mongolian (`mn`) support:
```typescript
export const translations = {
  ko: { appName: 'KIIP 기반 AI 한국어 학습 플랫폼', ... },
  mn: { appName: 'KIIP суурьтай AI Солонгос хэл сургалтын платформ', ... }
};
```

**Usage pattern** in components:
```typescript
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";

const { language } = useLanguageStore();
const t = translations[language];

// In JSX:
<h1>{t.appName}</h1>
```

**Language Switching**:
- UI includes Korean and Mongolian flag icons in Header component
- Clicking flags calls `setLanguage('ko')` or `setLanguage('mn')`
- Flags located at: `/public/images/flags/korea.png`, `/public/images/flags/mongol.png`

**Translation Keys**: All UI text must use translation keys from `translations.ts`. Do NOT hardcode Korean or Mongolian text in components.

### API Layer (services/api.ts)

**Centralized axios instance** with:
- Base URL from `VITE_API_URL` env var
- Request interceptor adds `Authorization: Bearer ${token}` from localStorage
- Organized by domain: `authAPI`, `wordAPI`, `categoryAPI`, `pronunciationAPI`, `unitAPI`, `recordingAPI`, `progressAPI`, `rankingAPI`, `adminAPI`

Each API module exports typed functions matching backend endpoints.

### Audio Recording

Uses browser **MediaRecorder API**:
- Records in WebM format
- Converts to FormData for multipart upload
- Handled by `RecordingControls.tsx` component
- Uploaded via `recordingAPI.uploadRecording()`

## Development Workflow

### Adding a new KIIP unit or lesson

1. Create unit via admin API: `POST /api/units`
2. Add lessons to unit: `POST /api/units/:id/lessons`
   - Required fields: `lessonNumber`, `title`, `titleMn`, `wordIds[]`, `isReview`
   - **Match ILesson interface**: Do NOT use `exercises`, `learningObjective` (not in schema)
3. Add challenge to unit: `POST /api/units/:id/challenge`
4. Update frontend `useUnitStore` to fetch and display

### Adding a new API endpoint

1. Define Mongoose model in `backend/src/models/` (if new entity)
2. Create controller in `backend/src/controllers/`:
   - Use `async (req: Request | AuthRequest, res: Response): Promise<void>`
   - ALWAYS `return` after `res.status().json()`
3. Add route in `backend/src/routes/`:
   - Apply `authenticate` middleware for protected routes
   - Apply `requireAdmin` for admin-only routes
4. Register route in `backend/src/index.ts`
5. Add API function to `frontend/src/services/api.ts`
6. Update TypeScript types in `frontend/src/types/index.ts`
7. Create/update Zustand store if needed

### Adding new UI translations

1. Open `frontend/src/utils/translations.ts`
2. Add new key to BOTH `ko` and `mn` objects:
   ```typescript
   ko: { newKey: '한국어 텍스트', ... },
   mn: { newKey: 'Монгол текст', ... }
   ```
3. Use in components:
   ```typescript
   const { language } = useLanguageStore();
   const t = translations[language];
   // <div>{t.newKey}</div>
   ```
4. TypeScript will enforce that all keys exist in both languages via `TranslationKey` type

### Seeding the database

**Initial setup** (run in order):
```bash
cd backend

# Method 1: Run all seeders at once (recommended)
npm run seed:all

# Method 2: Run individually in order
npm run seed:admin             # Admin user (admin@urimalzen.com / admin123!@#)
npm run seed:categories        # 14 KIIP categories
npm run seed:phoneme-rules     # Korean pronunciation rules
npm run migrate:flowers        # Migrate 9 flower words to new schema
npm run seed:kiip-words        # KIIP vocabulary by level
```

**Important**: `seed:all` includes admin user creation. Default admin credentials:
- Email: `admin@urimalzen.com`
- Password: `admin123!@#`
- **Change password after first login!**

## Environment Configuration

**Backend** (`backend/.env` - NOT in repository, create manually):
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urimalzen
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Frontend** (`frontend/.env` - in repository):
```bash
VITE_API_URL=http://localhost:5000/api
# For external access from other devices on network:
# VITE_API_URL=http://192.168.200.200:5000/api
# Or use public IP: http://112.220.79.218:5000/api
```

**First-time setup**:
1. Create `backend/.env` with the configuration above
2. Update `JWT_SECRET` to a random secure string
3. Verify `MONGODB_URI` matches your MongoDB installation
4. Update `frontend/.env` VITE_API_URL if accessing from external devices

## TypeScript Configuration

**Backend** (`tsconfig.json`):
- Module: `commonjs` (matching `package.json` type)
- Target: `es2020`
- Strict mode: enabled
- Compiles: `src/` → `dist/`
- Source maps and declaration files generated

**Frontend**: Vite's TypeScript setup with project references
- `tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`
- Module: `ESNext` (Vite handles bundling)
- React JSX support

## Deployment

**Production setup** (as documented in README):

1. **Backend**: PM2 process manager
   ```bash
   cd backend && npm run build
   pm2 start dist/index.js --name urimalzen-backend
   pm2 startup && pm2 save
   ```

2. **Frontend**: Static files via Nginx
   ```bash
   cd frontend && npm run build  # outputs to dist/
   # Copy dist/ to Nginx root
   ```

3. **Nginx config**:
   - Reverse proxy `/api` and `/uploads` to `localhost:5000`
   - Serve frontend static files with `try_files $uri /index.html` for SPA routing
   - CORS handled by backend (allows all origins in development)

## KIIP Integration

**Korea Immigration & Integration Program** (KIIP) integration features:

- **6 levels**: 0 (초급), 1-5 (중급-고급)
- **14 categories**: 인사, 자기소개, 음식, 쇼핑, 교통, etc.
- **CEFR mapping**: A1, A2, B1, B2, C1, C2
- **Curriculum**: Units → Lessons → Words → Challenges
- **Phoneme rules**: Korean pronunciation rules with examples
- **Progressive learning**: Difficulty scores, frequency ranks, word types

## Technology Versions

**Backend**:
- TypeScript: ^5.9.3
- Express: ^5.1.0
- Mongoose: ^8.20.0
- bcrypt: ^6.0.0
- jsonwebtoken: ^9.0.2
- multer: ^2.0.2

**Frontend**:
- React: ^19.2.0
- TypeScript: ~5.9.3
- Vite: ^7.2.2
- Zustand: ^5.0.8
- React Router: ^7.9.6
- Axios: ^1.13.2

## Common Pitfalls

1. **Express 5 response handling**: Controllers MUST `return` after `res.status().json()` to satisfy TypeScript `Promise<void>` return type. This is not optional.

2. **ILesson interface mismatch**: Unit lessons use `wordIds[]` and `isReview`, NOT `exercises[]` or `learningObjective`. Always check `backend/src/models/Unit.ts` for correct schema.

3. **MongoDB connection**: Ensure MongoDB is running (Docker or systemd) before starting backend. Check with `docker ps --filter "name=mongo"`.

4. **CORS**: Backend allows all origins (`origin: '*'`) for development. Restrict in production.

5. **File uploads**: Recordings saved to `backend/uploads/` - ensure directory exists or Multer will fail.

6. **Token storage**: Frontend stores token in BOTH Zustand state AND localStorage. Axios interceptor reads from localStorage. This redundancy is intentional for persistence.

7. **Build order**: Backend must compile TypeScript before production (`npm run build` then `npm start`). Frontend build includes TypeScript check (`tsc -b`).

8. **Nested schemas**: Unit model uses nested `lessonSchema` and `challengeSchema` with `_id: false`. When pushing to these arrays, match the exact interface fields.

9. **Mongoose index warnings**: Duplicate index warnings are expected due to both `unique: true` and explicit `schema.index()`. Safe to ignore in development.

10. **Translation completeness**: When adding UI text, ALWAYS add to both `ko` and `mn` objects in `translations.ts`. Missing translations will cause runtime errors.

11. **Language store persistence**: `useLanguageStore` does NOT persist to localStorage (unlike other stores). Language resets to `'ko'` on page refresh. This is intentional design.

12. **Backend .env missing**: Backend `.env` is NOT in the repository (gitignored). You MUST create it manually on first setup. Without it, the server will fail to start or use incorrect defaults.

13. **Admin credentials**: Default admin user created by `seed:all` or `seed:admin` with email `admin@urimalzen.com` and password `admin123!@#`. These are hardcoded in the seed script for development.

14. **External access**: Both frontend and backend listen on `0.0.0.0` (all interfaces). To access from other devices, update `VITE_API_URL` in `frontend/.env` to use server's IP address instead of localhost.

15. **Uploads directory**: `backend/uploads/` directory must exist for audio recording uploads. Created automatically by Multer, but if deleted, will cause upload failures.

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker ps --filter "name=mongo"

# Start MongoDB container
docker start urimalzen-mongodb

# Or create new MongoDB container
docker run -d -p 27017:27017 --name urimalzen-mongodb mongo:latest

# Check MongoDB logs
docker logs urimalzen-mongodb
```

### Backend Won't Start

```bash
# Common issues:
# 1. Missing .env file - create backend/.env with required variables
# 2. MongoDB not running - start MongoDB (see above)
# 3. Port 5000 already in use - check with: lsof -i :5000

# Check backend logs for specific errors
cd backend
npm run dev
```

### Frontend API Connection Issues

```bash
# 1. Verify backend is running on http://localhost:5000
curl http://localhost:5000/api/words

# 2. Check VITE_API_URL in frontend/.env
cat frontend/.env

# 3. For external access, update to server IP:
# VITE_API_URL=http://192.168.200.200:5000/api
```

### TypeScript Compilation Errors

```bash
# Backend compilation issues
cd backend
npm run build  # Check for type errors

# Frontend compilation issues
cd frontend
npm run build  # Runs tsc -b && vite build
```

### Database Seeding Failures

```bash
# If seeding fails midway, you may need to clear the database
# Connect to MongoDB and drop collections:
docker exec -it urimalzen-mongodb mongosh urimalzen
# In MongoDB shell:
# db.dropDatabase()
# exit

# Then re-run seeders
npm run seed:all
```
