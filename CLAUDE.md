# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**우리말젠 (Urimalzen)** - A Korean-Mongolian language learning web application for Mongolians learning Korean. Features vocabulary learning with KIIP (Korea Immigration & Integration Program) integration, pronunciation analysis, category-based learning, voice recording, progress tracking, multi-level ranking system, and advanced TTS/STT/AI capabilities.

**Stack**: Full-stack TypeScript application with React 19 frontend and Express 5 backend.

**Developer**: 김영훈 Manager (Kim Young-hoon Manager)

**Project Evolution**: Originally a simple 9-flower vocabulary app, evolved into a comprehensive KIIP-based Korean learning platform with full curriculum support, pronunciation analysis, admin dashboard, multi-level ranking system. Recently integrated TTS (Text-to-Speech), STT (Speech-to-Text), AI image generation (ComfyUI), and linguistic analysis (VocaPro) features. **Latest addition (Phase 1-4)**: TOPIK (Test of Proficiency in Korean) exam preparation system with full question bank, test sessions, and progress tracking - separated from KIIP curriculum.

## Repository Structure

```
urimalzen/
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/        # UI components (WordList, RecordingControls, etc.)
│   │   ├── pages/             # Route pages (Admin*, Learning, Categories, etc.)
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
│   │   ├── controllers/       # Request handlers (admin*, user*, word, etc.)
│   │   ├── models/            # Mongoose schemas (Word, User, Category, etc.)
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & file upload
│   │   ├── services/          # Business logic (ttsService, sttService, aiService, etc.)
│   │   ├── utils/             # Seed scripts
│   │   └── index.ts           # Server entry point
│   ├── uploads/               # User-uploaded files (audio)
│   └── .env                   # Environment config (currently in repo for dev, should be gitignored in production)
│
├── requirements/               # Requirements documentation
│   └── screen/                # UI screenshots
│
├── COMFYUI_GUIDE.md           # ComfyUI integration guide
├── MzTTS_API_Interface.md     # MzTTS API documentation
├── VocaPro_API_Interface.md   # VocaPro API documentation
└── SPEECHPRO_API_Interface.md # SpeechPro API documentation
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

**Note**: Currently working on Phase 4 TOPIK implementation. Many models and controllers have recent modifications.

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
- Create `.env` file (see backend/.env for example configuration)

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

**Word Model** - Comprehensive vocabulary data with KIIP integration and external API data:
- Basic fields: `koreanWord`, `mongolianWord`, `chineseWord`, `pronunciation`, `imageUrl`, `description`
- KIIP/CEFR levels: `level.kiip` (0-5), `level.cefr` (A1-C2)
- 14-category system: `mainCategory`, `subCategory`
- Pronunciation: `phonemeRules[]`, `standardPronunciation`
- Vocabulary relationships: `synonyms[]`, `antonyms[]`, `collocations[]`, `relatedWords[]`
- Learning metadata: `wordType`, `formalityLevel`, `difficultyScore`, `frequencyRank`
- Examples array with Korean-Mongolian pairs
- **SpeechPro data** (pronunciation model): `syllLtrs`, `syllPhns`, `fst`, `lastUpdated`, `errorCode`
- **VocaPro data** (linguistic analysis): `morphemes[]`, `definitions[]`, `cefrAnalysis`, `synonymsExtended[]`, `antonymsExtended[]`, `lastUpdated`, `errorCode`
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

**TOPIKQuestion Model** - TOPIK exam questions:
- Question metadata: `questionNumber`, `questionType`, `testSection`, `topikLevel` (1-6)
- Content: `questionText`, `questionTextMn`, `options[]`, `correctAnswer`
- Media: `audioUrl`, `imageUrl` (for listening/visual questions)
- Relationships: `relatedWordIds[]`, `grammarPattern`, `tags[]`
- Usage tracking: `attemptCount`, `correctCount`, `averageScore`

**TOPIKTestSession Model** - User test sessions:
- Test metadata: `userId`, `topikLevel`, `testSection`, `startTime`, `endTime`
- Answers: `userAnswers[]` array with question ID, user answer, correct answer, time spent
- Scoring: `score`, `totalQuestions`, `correctCount`
- Status: `status` (in-progress, completed, abandoned)

**TOPIKProgress Model** - Long-term TOPIK progress tracking:
- Per-user document with `userId`, `currentLevel`, `targetLevel`
- Section scores: `listeningScore`, `readingScore`, `writingScore`
- History: `testHistory[]`, `weakAreas[]`, `strongAreas[]`

### External API Services

The application integrates with three external AI/voice services:

**1. MzTTS (Text-to-Speech)**
- Location: `backend/src/services/ttsService.ts`
- API: `http://112.220.79.218:56014` (configured via `MZTTS_API_URL`)
- Function: `requestMzTTS(text, options)`
- Features: Multi-speaker Korean TTS with emotion control (neutral, pleasure, anger, sadness)
- Output formats: `file` (WAV direct), `pcm` (base64), `path` (server path)
- Parameters: `DEFAULTSPEAKER` (0-7), `DEFAULTTEMPO` (0.1-2.0), `DEFAULTPITCH` (0.1-2.0), `DEFAULTGAIN` (0.1-2.0)
- Documentation: `MzTTS_API_Interface.md`

**2. SpeechPro (Pronunciation Evaluation)**
- Location: `backend/src/services/speechproService.ts` (recently added)
- API: `http://112.220.79.222:33005/speechpro` (configured via `SPEECHPRO_API_URL`)
- Three-step workflow:
  1. **GTP (Grapheme-to-Phoneme)**: Convert Korean text to phonemes → `callGTP()`
  2. **Model**: Generate FST pronunciation model → `callModel()`
  3. **Score**: Evaluate user pronunciation against model → `callScore()`
- Data stored in Word model's `speechPro` field: `syllLtrs`, `syllPhns`, `fst`
- Documentation: `SPEECHPRO_API_Interface.md`

**3. VocaPro (Linguistic Analysis)**
- Location: `backend/src/services/vocaproService.ts` (recently added)
- API: `https://api.vocapro.example.com` (configured via `VOCAPRO_API_URL`)
- Features: Word analysis (morphemes, POS tagging), CEFR level prediction, synonyms/antonyms extraction
- Supports 4 languages: Korean (`kor`), Chinese (`chi`), Japanese (`jap`), English (`eng`)
- Data stored in Word model's `vocaPro` field
- Documentation: `VocaPro_API_Interface.md`

**4. ComfyUI (AI Image Generation)**
- Location: `backend/src/services/comfyuiService.ts`
- API: `http://localhost:8188` (configured via `COMFYUI_API_URL`)
- Features: Stable Diffusion XL-based word illustration generation
- Workflow: Submit prompt → Poll queue status → Download generated image
- Used for generating educational word images automatically
- Requires local ComfyUI installation with SDXL models
- Documentation: `COMFYUI_GUIDE.md`

**5. Ollama (Local LLM)**
- Used for AI text generation features
- API: `http://localhost:11434/api` (configured via `OLLAMA_API_URL`)
- Default model: `exaone3.5:7.8b`
- Location: `backend/src/services/aiService.ts`

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
/api/admin         - Admin-only operations

Admin-only routes (require authenticate + requireAdmin):
/api/admin/ai      - AI content generation (Ollama)
/api/admin/tts     - TTS management (MzTTS, SpeechPro)
/api/admin/stt     - STT/pronunciation evaluation (SpeechPro)
/api/admin/stats   - Dashboard statistics
/api/admin/comfyui - ComfyUI image generation
/api/admin/topik   - TOPIK question management

User routes (require authenticate):
/api/user/tts      - User TTS requests
/api/user/stt      - User pronunciation evaluation

TOPIK routes (require authenticate):
/api/topik/questions         - TOPIK questions by level/section
/api/topik/test/start        - Start new test session
/api/topik/test/:id/submit   - Submit test answers
/api/topik/progress          - User TOPIK progress
```

## Frontend Architecture

**Pattern**: React 19 with Zustand state management and React Router v7

### Routing Structure

Protected routes using `isAuthenticated` check:

**KIIP Learning Routes**:
- `/login` - User login
- `/` and `/learning` - Main learning interface (original 9 flowers)
- `/categories` - Browse 14 KIIP categories
- `/levels` - KIIP level selection (0-5)
- `/pronunciation` - Phoneme rules and pronunciation practice
- `/units` - KIIP curriculum units and lessons
- `/sentence-learning` - Sentence-based learning (stories, contextual examples)

**TOPIK Exam Routes**:
- `/topik` - TOPIK home page
- `/topik/levels` - TOPIK level selection (1-6)
- `/topik/test` - Take TOPIK practice test
- `/topik/progress` - View TOPIK progress and history

**Admin Routes**:
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Admin panel home
- `/admin/users` - User management
- `/admin/words` - Word CRUD
- `/admin/recordings` - Recording management
- `/admin/statistics` - System statistics
- `/admin/ai-content` - AI content generation
- `/admin/tts` - TTS management
- `/admin/stt` - STT/pronunciation management
- `/admin/comfyui` - ComfyUI image generation
- `/admin/kiip` - KIIP curriculum management
- `/admin/system` - System configuration and API settings

All user routes redirect to `/login` if not authenticated.
All admin routes redirect to `/admin/login` if not authenticated or not admin.

### State Management (Zustand)

**Seven main stores** with persist middleware:

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
   - State: `language` (type: `'ko' | 'mn' | 'zh'`)
   - Action: `setLanguage(lang)`
   - Does NOT persist (defaults to 'ko' on refresh)
   - Used by Header and other UI components for translation display
   - Supports Korean, Mongolian, and Chinese (recently added)

7. **useTOPIKStore** - TOPIK exam system:
   - Test session state, questions, user answers
   - Progress tracking, test history
   - Used by `/topik/*` routes
   - Persists active test session to prevent data loss

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

**Structure**: Object-based translations with Korean (`ko`), Mongolian (`mn`), and Chinese (`zh`) support:
```typescript
export const translations = {
  ko: { appName: 'KIIP 기반 AI 한국어 학습 플랫폼', ... },
  mn: { appName: 'KIIP суурьтай AI Солонгос хэл сургалтын платформ', ... },
  zh: { appName: 'KIIP AI 韩语学习平台', ... }  // Recently added
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
- UI includes Korean, Mongolian, and Chinese flag icons in Header component
- Clicking flags calls `setLanguage('ko')`, `setLanguage('mn')`, or `setLanguage('zh')`
- Flags located at: `/public/images/flags/korea.png`, `/public/images/flags/mongol.png`, `/public/images/flags/china.webp`
- Chinese language support recently added to support expanding user base

**Translation Keys**: All UI text must use translation keys from `translations.ts`. Do NOT hardcode Korean, Mongolian, or Chinese text in components.

### API Layer (services/api.ts)

**Centralized axios instance** with:
- Base URL from `VITE_API_URL` env var
- Request interceptor adds `Authorization: Bearer ${token}` from localStorage
- Organized by domain: `authAPI`, `wordAPI`, `categoryAPI`, `pronunciationAPI`, `unitAPI`, `recordingAPI`, `progressAPI`, `rankingAPI`, `adminAPI`, `aiAPI`, `ttsAPI`, `sttAPI`, `comfyuiAPI`, `topikAPI`

Each API module exports typed functions matching backend endpoints.

**TOPIK API module** includes:
- `getQuestions(level, section)` - Fetch TOPIK questions
- `startTest(level, section)` - Create new test session
- `submitAnswer(sessionId, questionId, answer)` - Submit individual answer
- `finishTest(sessionId)` - Complete test and get score
- `getProgress()` - Get user's TOPIK progress

### Audio Recording

Uses browser **MediaRecorder API**:
- Records in WebM format
- Converts to FormData for multipart upload
- Handled by `RecordingControls.tsx` component
- Uploaded via `recordingAPI.uploadRecording()`

## Development Workflow

### System Overview for Developers

**The platform has two main learning tracks**:
1. **KIIP Track** - Vocabulary-based learning with categories, units, lessons (data model: Word, Category, Unit)
2. **TOPIK Track** - Exam preparation with questions, test sessions, scoring (data model: TOPIKQuestion, TOPIKTestSession)

**External integrations**:
- **MzTTS** - Korean TTS for word pronunciation
- **SpeechPro** - Pronunciation evaluation (GTP → Model → Score workflow)
- **VocaPro** - Linguistic analysis (morphemes, CEFR levels)
- **ComfyUI** - AI image generation for vocabulary
- **Ollama** - Local LLM for content generation

**Admin features** (12 pages):
- Dashboard, Users, Words, Recordings, Statistics
- AI Content, TTS, STT, ComfyUI, KIIP, System

**Development mode tips**:
- Use separate terminals for frontend and backend
- MongoDB must be running before backend starts
- Check `.env` files for correct API URLs
- Use `npm run seed:all` for initial data setup

### Working with External APIs (TTS/STT/AI)

**Testing MzTTS locally**:
```bash
# Test MzTTS API is accessible
curl http://112.220.79.218:56014

# Test TTS generation
curl -X POST http://112.220.79.218:56014 \
  -H "Content-Type: application/json" \
  -d '{"output_type":"path","_TEXT":"안녕하세요","_SPEAKER":0}'
```

**Testing SpeechPro locally**:
```bash
# Test GTP endpoint
curl -X POST http://112.220.79.222:33005/speechpro/gtp \
  -H "Content-Type: application/json" \
  -d '{"id":"test","text":"안녕하세요"}'
```

**Setting up ComfyUI** (see `COMFYUI_GUIDE.md` for full instructions):
```bash
# 1. Clone ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 2. Install dependencies
pip install -r requirements.txt

# 3. Download SDXL model to ComfyUI/models/checkpoints/
# wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors

# 4. Start ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

### Adding a new KIIP unit or lesson

1. Create unit via admin API: `POST /api/units`
2. Add lessons to unit: `POST /api/units/:id/lessons`
   - Required fields: `lessonNumber`, `title`, `titleMn`, `wordIds[]`, `isReview`
   - **Match ILesson interface**: Do NOT use `exercises`, `learningObjective` (not in schema)
3. Add challenge to unit: `POST /api/units/:id/challenge`
4. Update frontend `useUnitStore` to fetch and display

### Adding TOPIK questions

**Via Admin UI** (`/admin/system`):
1. Navigate to TOPIK Questions section
2. Select level (1-6) and section (listening/reading/writing)
3. Enter question text in Korean and Mongolian
4. Add options for multiple-choice questions
5. Set correct answer, points, and difficulty score
6. Optionally add audio/image URLs and related word IDs

**Via Seed Script**:
1. Edit `backend/src/utils/seedTopikQuestions.ts`
2. Add question data to the questions array:
   ```typescript
   {
     questionNumber: 1,
     questionType: 'multiple-choice',
     testSection: 'reading',
     topikLevel: 2,
     questionText: '다음 빈칸에 알맞은 것을 고르십시오.',
     questionTextMn: 'Дараах хоосон зайг бөглөнө үү.',
     options: [
       { text: '가다', textMn: 'явах' },
       { text: '오다', textMn: 'ирэх' }
     ],
     correctAnswer: 0,
     explanation: '...',
     explanationMn: '...',
     points: 2,
     difficultyScore: 30,
     tags: ['grammar', 'verbs']
   }
   ```
3. Run `npm run seed:topik-questions`

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
2. Add new key to ALL language objects (`ko`, `mn`, `zh`):
   ```typescript
   ko: { newKey: '한국어 텍스트', ... },
   mn: { newKey: 'Монгол текст', ... },
   zh: { newKey: '中文文本', ... }
   ```
3. Use in components:
   ```typescript
   const { language } = useLanguageStore();
   const t = translations[language];
   // <div>{t.newKey}</div>
   ```
4. TypeScript will enforce that all keys exist in all languages via `TranslationKey` type

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
npm run seed:topik-words       # TOPIK-specific vocabulary
npm run seed:topik-questions   # TOPIK exam questions (Phase 4)
```

**Note**: The `seed:all` script automatically runs all seeders including TOPIK questions.

**Important**: `seed:all` includes admin user creation. Default admin credentials:
- Email: `admin@urimalzen.com`
- Password: `admin123!@#`
- **Change password after first login!**

## Environment Configuration

**Backend** (`backend/.env` - currently in repository for development, should be gitignored in production):
```bash
# Core Server Configuration
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urimalzen
JWT_SECRET=your-secret-key-change-this-in-production

# SpeechPro API (pronunciation evaluation/TTS/STT)
SPEECHPRO_API_URL=http://112.220.79.222:33005/speechpro

# MzTTS API (Korean multi-speaker TTS)
MZTTS_API_URL=http://112.220.79.218:56014
TTS_API_URL=http://112.220.79.218:56014
TTS_API_KEY=
TTS_DEFAULT_VOICE=ko-KR-Wavenet-A
TTS_DEFAULT_SPEED=1.0
TTS_DEFAULT_PITCH=0.0
TTS_OUTPUT_FORMAT=mp3

# STT Configuration
STT_API_URL=${SPEECHPRO_API_URL}/stt
STT_API_KEY=
STT_LANGUAGE=ko-KR
STT_ACCURACY_THRESHOLD=0.7

# VocaPro API (linguistic analysis)
VOCAPRO_API_URL=https://api.vocapro.example.com
VOCAPRO_API_KEY=

# Ollama Configuration (local LLM)
OLLAMA_API_URL=http://localhost:11434/api
OLLAMA_MODEL=exaone3.5:7.8b
OLLAMA_TEMPERATURE=0.7
OLLAMA_MAX_TOKENS=2000

# ComfyUI Configuration (image generation)
COMFYUI_API_URL=http://localhost:8188

# Optional: OpenAI API (alternative to Ollama)
OPENAI_API_KEY=

# Optional: Google Cloud (alternative TTS/STT)
GOOGLE_APPLICATION_CREDENTIALS=

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

**Frontend** (`frontend/.env` - in repository):
```bash
VITE_API_URL=http://localhost:5000/api
# For external access from other devices on network:
# VITE_API_URL=http://192.168.200.200:5000/api
# Or use public IP: http://112.220.79.218:5000/api
```

**First-time setup**:
1. Backend `.env` exists in development - review and update values as needed
2. **IMPORTANT**: Update `JWT_SECRET` to a random secure string in production
3. Verify `MONGODB_URI` matches your MongoDB installation
4. Update API URLs if services are on different hosts/ports
5. Update `frontend/.env` VITE_API_URL if accessing from external devices
6. **Production**: Add `.env` to `.gitignore` and never commit production secrets

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

## KIIP vs TOPIK: Two Learning Tracks

The platform now supports **two separate but complementary** Korean learning systems:

### KIIP (Korea Immigration & Integration Program)
**Purpose**: Government-mandated integration program for immigrants
**Focus**: Practical daily life Korean for social integration
**Structure**:
- **6 levels**: 0 (초급), 1-5 (중급-고급)
- **14 categories**: 인사, 자기소개, 음식, 쇼핑, 교통, etc.
- **CEFR mapping**: A1, A2, B1, B2, C1, C2
- **Curriculum**: Units → Lessons → Words → Challenges
- **Phoneme rules**: Korean pronunciation rules with examples
- **Progressive learning**: Difficulty scores, frequency ranks, word types

**Routes**: `/learning`, `/categories`, `/levels`, `/pronunciation`, `/units`, `/sentence-learning`

**Recent additions**:
- Story-based learning components (`FunStoryContent.tsx`, `StoryList.tsx`)
- Contextual sentence learning page (`SentenceLearning.tsx`)
- Story images for visual learning aids

### TOPIK (Test of Proficiency in Korean)
**Purpose**: Standardized Korean proficiency test for academic/professional purposes
**Focus**: Formal language assessment and exam preparation
**Structure**:
- **6 levels**: 1 (초급), 2 (초급), 3 (중급), 4 (중급), 5 (고급), 6 (고급)
- **3 sections**: Listening, Reading, Writing
- **Question types**: Multiple-choice, fill-in-blank, essay, short-answer, listening comprehension
- **Test sessions**: Timed tests with scoring and analytics
- **Progress tracking**: Historical performance, weak/strong areas, improvement trends

**Routes**: `/topik`, `/topik/levels`, `/topik/test`, `/topik/progress`

**Key Difference**: KIIP is for learning practical Korean for daily life, while TOPIK is for formal proficiency certification and exam preparation. Users can use both tracks simultaneously.

## Technology Versions

**Backend**:
- TypeScript: ^5.9.3
- Express: ^5.1.0
- Mongoose: ^8.20.0
- bcrypt: ^6.0.0
- jsonwebtoken: ^9.0.2
- multer: ^2.0.2
- axios: ^1.13.2

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

10. **Translation completeness**: When adding UI text, ALWAYS add to all language objects (`ko`, `mn`, `zh`) in `translations.ts`. Missing translations will cause runtime errors.

11. **Language store persistence**: `useLanguageStore` does NOT persist to localStorage (unlike other stores). Language resets to `'ko'` on page refresh. This is intentional design to ensure users always start with Korean (as the learning target language).

12. **Backend .env security**: Backend `.env` is currently in the repository for development convenience. In production, this file should be gitignored and created manually with secure credentials. Never commit production secrets to version control.

13. **Admin credentials**: Default admin user created by `seed:all` or `seed:admin` with email `admin@urimalzen.com` and password `admin123!@#`. These are hardcoded in the seed script for development.

14. **External access**: Both frontend and backend listen on `0.0.0.0` (all interfaces). To access from other devices, update `VITE_API_URL` in `frontend/.env` to use server's IP address instead of localhost.

15. **Uploads directory**: `backend/uploads/` directory must exist for audio recording uploads. Created automatically by Multer, but if deleted, will cause upload failures.

16. **External API dependencies**: MzTTS, SpeechPro, and VocaPro are external services. If these services are down or URLs are incorrect in `.env`, related features will fail. Check API connectivity with curl commands (see Development Workflow section).

17. **ComfyUI model size**: Stable Diffusion XL models are ~6-7GB. Ensure sufficient disk space in `ComfyUI/models/checkpoints/` directory before downloading.

18. **SpeechPro workflow**: Pronunciation model generation (`callGTP` → `callModel`) must be done once per word and stored in database. Don't regenerate models on every pronunciation evaluation request - use stored `fst` data.

19. **Word model extended fields**: When adding/updating words, `speechPro` and `vocaPro` fields are optional. These are populated by admin TTS/STT/analysis features, not required for basic word CRUD.

20. **TOPIK vs KIIP confusion**: TOPIK and KIIP are separate systems with different level numbering (KIIP: 0-5, TOPIK: 1-6). Do not mix their data models or APIs. Check routes and models carefully - use `TOPIKQuestion` model for TOPIK, `Word` model for KIIP.

21. **TOPIK test session persistence**: Active TOPIK test sessions are stored in both database (TOPIKTestSession) and Zustand store (useTOPIKStore with persist). When resuming a test, check store first, then database. Do NOT create duplicate sessions.

22. **Test answer time tracking**: Each answer in TOPIK test sessions includes `timeSpent` field. The frontend must track and submit this data for analytics. Missing time data will affect progress analysis.

23. **TOPIK question seeding**: The `seed:topik-questions` script is included in `seed:all`. TOPIK questions require proper Korean-Mongolian translations in both `questionText` and `questionTextMn` fields. Audio/image URLs are optional but should be validated if provided.

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

### External API Connection Issues

```bash
# Test MzTTS connectivity
curl http://112.220.79.218:56014

# Test SpeechPro connectivity
curl http://112.220.79.222:33005/speechpro/gtp

# Test ComfyUI connectivity
curl http://localhost:8188/system_stats

# Test Ollama connectivity
curl http://localhost:11434/api/tags
```

### ComfyUI Issues

```bash
# Check if ComfyUI is running
curl http://localhost:8188/system_stats

# Start ComfyUI if not running
cd /path/to/ComfyUI
python main.py --listen 0.0.0.0 --port 8188

# Check if SDXL model exists
ls -lh ComfyUI/models/checkpoints/sd_xl_base_1.0.safetensors

# Check ComfyUI logs for errors
# (visible in terminal where ComfyUI is running)
```

### TOPIK Test Issues

```bash
# Check if TOPIK questions are seeded
docker exec -it urimalzen-mongodb mongosh urimalzen
# In MongoDB shell:
# db.topikquestions.countDocuments()
# db.topikquestions.find({ topikLevel: 2 }).limit(5)
# exit

# Re-seed TOPIK questions if empty
cd backend
npm run seed:topik-questions

# Check active test sessions
# In MongoDB shell:
# db.topiktestsessions.find({ status: 'in-progress' })

# Clear abandoned test sessions (if stuck)
# db.topiktestsessions.deleteMany({ status: 'in-progress', startTime: { $lt: new Date(Date.now() - 24*60*60*1000) } })
```

**Common TOPIK frontend issues**:
- **Test not resuming**: Check if `useTOPIKStore` has persisted session data in localStorage
- **Questions not loading**: Verify API endpoint `/api/topik/questions?level=X&section=Y` returns data
- **Timer not working**: Ensure test session has valid `startTime` and check browser Date API
- **Answers not saving**: Check network tab for failed PUT requests to `/api/topik/test/:id/submit`
