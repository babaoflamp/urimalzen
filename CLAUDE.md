# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**우리말젠 (Urimalzen)** - A Korean-Mongolian language learning web application for Mongolians learning Korean. The app features vocabulary learning with 9 flower names, voice recording, progress tracking, and a multi-level ranking system (global/country/region).

**Stack**: Full-stack TypeScript application with React frontend and Express backend.

## Repository Structure

```
urimalzen/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express + TypeScript + MongoDB
└── requirements/      # Requirements documentation
```

## Common Development Commands

### Backend (Express + TypeScript + MongoDB)

```bash
cd backend

# Development
npm run dev              # Start with hot-reload (nodemon + ts-node)
npm run build            # Compile TypeScript to dist/
npm start                # Run compiled code (production)

# Database
npm run seed             # Seed initial 9 flower words to MongoDB

# Note: No test or lint commands configured
```

**Server**: `http://localhost:5000` (configured for external access via `0.0.0.0`)

### Frontend (React + Vite + TypeScript)

```bash
cd frontend

# Development
npm run dev              # Start dev server with HMR
npm run build            # TypeScript compile + Vite build
npm run preview          # Preview production build
npm run lint             # ESLint

# Note: No test commands configured
```

**Server**: `http://localhost:5173` (configured for external access via `0.0.0.0`)

### Prerequisites

**Backend requires**:
- MongoDB running on `localhost:27017` (or set `MONGODB_URI` in `.env`)
- Node.js (TypeScript compilation via `tsc`)

**Seeding**: Run `npm run seed` in backend to populate 9 flower vocabulary words.

## Backend Architecture

**Pattern**: MVC with Mongoose ODM

**Directory structure**:
```
backend/src/
├── index.ts              # Express app entry, CORS, MongoDB connection
├── models/               # Mongoose schemas with TypeScript interfaces
│   ├── User.ts           # IUser with bcrypt password hashing
│   ├── Word.ts           # IWord with examples, synonyms
│   ├── Recording.ts      # Audio recording metadata
│   ├── UserProgress.ts   # Learning progress per word
│   └── Ranking.ts        # User ranking data
├── controllers/          # Request handlers (async functions)
│   ├── authController.ts
│   ├── wordController.ts
│   ├── recordingController.ts
│   ├── progressController.ts
│   └── rankingController.ts
├── routes/               # Express routers
├── middleware/
│   ├── auth.ts           # JWT authentication + admin check
│   └── upload.ts         # Multer file upload config
└── utils/
    ├── jwt.ts            # JWT token generation/verification
    └── seedWords.ts      # Database seeding script
```

**Key patterns**:

1. **Models**: Mongoose schemas with TypeScript interfaces extending `Document`
   - Pre-save hooks (e.g., password hashing in User model)
   - Instance methods (e.g., `comparePassword` in User)
   - Indexes for performance (e.g., `order` and `category` in Word)

2. **Controllers**: Async functions with explicit `Promise<void>` return type
   - Controllers use `res.status().json()` and must `return` after sending response
   - Error handling with try-catch, logging to console
   - Type safety with `AuthRequest` interface (extends `Request` with `user` property)

3. **Authentication**:
   - JWT tokens in `Authorization: Bearer <token>` header
   - `authenticate` middleware attaches user to `req.user`
   - `requireAdmin` middleware checks `req.user.isAdmin`

4. **File uploads**: Multer saves audio recordings to `backend/uploads/` directory
   - Served statically via `/uploads` route

## Frontend Architecture

**Pattern**: React 19 with Zustand state management and TypeScript

**Directory structure**:
```
frontend/src/
├── main.tsx              # React app entry
├── App.tsx               # Router setup (react-router-dom)
├── pages/                # Route components
│   ├── Login.tsx
│   ├── Learning.tsx
│   ├── AdminLogin.tsx
│   └── AdminDashboard.tsx
├── components/           # Reusable UI components
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── LearningArea.tsx
│   ├── WordList.tsx
│   ├── RecordingControls.tsx  # MediaRecorder API integration
│   ├── RankingInfo.tsx
│   └── SelfStudy.tsx
├── store/                # Zustand stores with persist middleware
│   ├── useAuthStore.ts   # Authentication state + token in localStorage
│   └── useLearningStore.ts
├── services/
│   └── api.ts            # Axios client + API functions (authAPI, wordAPI, etc.)
└── types/
    └── index.ts          # Shared TypeScript types
```

**Key patterns**:

1. **State management**: Zustand with persistence
   - `useAuthStore`: Manages user, token, isAuthenticated
   - Persists to localStorage via `persist` middleware
   - Token automatically added to requests via axios interceptor

2. **API layer**: Centralized in `services/api.ts`
   - Organized by domain: `authAPI`, `wordAPI`, `recordingAPI`, `progressAPI`, `rankingAPI`, `adminAPI`
   - Axios instance with `baseURL` from `VITE_API_URL` env var
   - Request interceptor adds `Authorization` header from localStorage

3. **Recording**: Uses browser MediaRecorder API
   - Records audio in WebM format
   - Converts to FormData for upload via `recordingAPI.uploadRecording`

## Database Models

**User Model** (`models/User.ts`):
- Fields: `username`, `email`, `password` (hashed), `level` (CEFR + KIIP), `totalScore`, `region`, `country`, `isAdmin`
- Pre-save hook: bcrypt password hashing (salt rounds: 10)
- Method: `comparePassword(candidatePassword)` - async bcrypt comparison
- Timestamps: auto-managed by Mongoose

**Word Model** (`models/Word.ts`):
- Fields: `koreanWord`, `mongolianWord`, `imageUrl`, `description`, `pronunciation`, `category`, `order`, `examples[]`, `synonyms[]`, `videoUrl`, `readingContent`
- Unique indexes on `koreanWord` and `order`
- Performance indexes on `order` and `category`

**Recording Model**:
- References: `userId`, `wordId`
- File metadata: `audioUrl`, `duration`, `fileSize`

**UserProgress Model**:
- Tracks completion and score per word per user
- Fields: `userId`, `wordId`, `completed`, `score`, `attempts`

**Ranking Model**:
- One document per user
- Fields: `userId`, `rank`, scores by level

## API Endpoints

All routes prefixed with `/api`:

**Authentication** (`/api/auth`):
- `POST /register` - Create account (auto-creates Ranking entry)
- `POST /login` - Returns JWT token
- `GET /profile` - Get current user (requires auth)

**Words** (`/api/words`):
- `GET /` - List all words
- `GET /:id` - Get word by ID
- `GET /order/:order` - Get word by order number (1-9)

**Recordings** (`/api/recordings`):
- `POST /` - Upload recording (multipart/form-data with auth)
- `GET /` - Get user's recordings (requires auth)
- `GET /word/:wordId` - Get recordings for specific word

**Progress** (`/api/progress`):
- `GET /` - Get user's progress (requires auth)
- `POST /` - Update progress for a word (requires auth)

**Rankings** (`/api/rankings`):
- `GET /me` - Get current user's ranking
- `GET /global` - Global leaderboard
- `GET /country/:country` - Country leaderboard
- `GET /region/:region` - Region leaderboard

**Admin** (`/api/admin`) - All require `authenticate` + `requireAdmin` middleware:
- `GET /stats` - Dashboard statistics
- User management: `GET /users`, `GET /users/:id`, `PATCH /users/:id/admin`
- Word management: `GET /words`, `POST /words`, `PUT /words/:id`, `DELETE /words/:id`
- Recording management: `GET /recordings`

## Environment Configuration

**Backend** (`.env`):
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urimalzen
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

**Frontend** (`.env`):
```bash
VITE_API_URL=http://localhost:5000/api
# For external access, use server IP instead of localhost
```

## TypeScript Configuration

**Backend** (`tsconfig.json`):
- Module: `commonjs` (matching `package.json` type)
- Target: `es2020`
- Strict mode enabled
- Compiles `src/` → `dist/`
- Source maps and declaration files generated

**Frontend**: Uses Vite's TypeScript setup with project references
- `tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`
- Module: `ESNext` (Vite handles bundling)
- React JSX support

## Deployment Considerations

**Production deployment** (as documented in README):

1. **Backend**: PM2 process manager
   ```bash
   npm run build
   pm2 start dist/index.js --name urimalzen-backend
   pm2 startup && pm2 save
   ```

2. **Frontend**: Static files served via Nginx
   ```bash
   npm run build  # Outputs to dist/
   # Copy dist/ to Nginx root
   ```

3. **Nginx config**: Reverse proxy `/api` and `/uploads` to backend:5000, serve frontend static files for all other routes with `try_files $uri /index.html` for SPA routing.

## Initial Data

The database includes 9 Korean flower vocabulary words:
1. 만들레 (민들레/Dandelion) - Цэцэрлэг
2. 환주리 - Хуануури
3. 들국화 (Wild Chrysanthemum) - Хээрийн хризантем
4. 은방울 (Lily of the Valley) - Мөнгөн хонх
5. 개나리 (Forsythia) - Форзици
6. 진달래 (Azalea) - Азалиа
7. 패랭이 (Pink/Dianthus) - Гвоздик
8. 제비꽃 (Violet) - Нил цэцэг
9. 해바라기 (Sunflower) - Наранцэцэг

Load via: `cd backend && npm run seed`

## Development Workflow

**Adding a new API endpoint**:

1. Define Mongoose model in `backend/src/models/` (if new entity)
2. Create controller function in `backend/src/controllers/`
   - Use `async (req: Request | AuthRequest, res: Response): Promise<void>`
   - Always `return` after `res.status().json()`
3. Add route in `backend/src/routes/`
   - Apply `authenticate` middleware for protected routes
4. Add API function to `frontend/src/services/api.ts`
5. Update TypeScript types in `frontend/src/types/index.ts`

**Adding authentication to a route**:
```typescript
import { authenticate, requireAdmin } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

router.get('/protected', authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;  // Available after authenticate middleware
  // ...
});
```

**State management pattern**:
```typescript
// In Zustand store
export const useStore = create<State>()(
  persist(
    (set) => ({
      // state and actions
    }),
    { name: 'storage-key' }
  )
);
```

## Technology Versions

**Backend**:
- Node.js (ts-node for development)
- TypeScript: ^5.9.3
- Express: ^5.1.0
- Mongoose: ^8.20.0
- bcrypt: ^6.0.0
- jsonwebtoken: ^9.0.2

**Frontend**:
- React: ^19.2.0
- TypeScript: ~5.9.3
- Vite: ^7.2.2
- Zustand: ^5.0.8
- React Router: ^7.9.6
- Axios: ^1.13.2

## Common Pitfalls

1. **Express 5 response handling**: Controllers must `return` after `res.status().json()` to satisfy TypeScript `Promise<void>` return type.

2. **MongoDB connection**: Ensure MongoDB is running before starting backend. Connection string defaults to `localhost:27017/urimalzen`.

3. **CORS**: Backend allows all origins (`origin: '*'`) for development. Restrict in production.

4. **File uploads**: Recordings saved to `backend/uploads/` - ensure directory exists or Multer will fail.

5. **Authentication**: Frontend stores token in both Zustand state AND localStorage. Axios interceptor reads from localStorage.

6. **Build order**: Backend must compile TypeScript before running production (`npm run build` then `npm start`). Frontend build includes TypeScript check (`tsc -b`).
