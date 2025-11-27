# Deployment and Testing Guide

## Complete KIIP Implementation Status

### ✅ All Features Implemented

The Urimalzen application has been successfully upgraded from a simple 9-flower vocabulary app to a comprehensive KIIP (Korea Immigration Integration Program) learning platform.

## Implementation Checklist

### Backend (Complete)

- ✅ **Data Models** (Week 1)
  - Extended Word model with KIIP fields (level, categories, phoneme rules)
  - Created Category model (14 major categories)
  - Created PhonemeRule model (5 Korean pronunciation rules)
  - Created Unit/Lesson/Challenge models for learning paths
  - Created migration script for existing flower words

- ✅ **Controllers** (Week 2)
  - categoryController.ts (CRUD + statistics)
  - Extended wordController.ts (level/category filtering, search)
  - pronunciationController.ts (phoneme analysis)
  - unitController.ts (learning path management)

- ✅ **Routes** (Week 2)
  - `/api/categories` - 8 endpoints
  - `/api/pronunciation` - 2 endpoints
  - `/api/units` - 6 endpoints
  - Extended `/api/words` - 4 new endpoints

- ✅ **Seed Scripts** (Week 1-2)
  - seedCategories.ts - 14 major categories
  - seedPhonemeRules.ts - 5 pronunciation rules
  - seedKiipWords.ts - 26 sample KIIP words
  - migrateFlowerWords.ts - Update existing 9 words
  - Combined seed:all command

### Frontend (Complete)

- ✅ **Types** (Week 3)
  - Extended Word interface with KIIP fields
  - Added Category, PhonemeRule, Unit, Lesson, Challenge interfaces
  - Added SearchCriteria, PronunciationAnalysisResult types

- ✅ **API Services** (Week 3)
  - categoryAPI - 8 methods
  - pronunciationAPI - 2 methods
  - unitAPI - 6 methods
  - Extended wordAPI - 4 new methods

- ✅ **State Management** (Week 3)
  - useCategoryStore (Zustand)
  - usePronunciationStore (Zustand)
  - useUnitStore (Zustand)
  - Extended useLearningStore with filtering

- ✅ **UI Components** (Week 4)
  - CategoryGrid.tsx - Display 14 categories
  - LevelSelector.tsx - Select KIIP levels 0-5
  - PronunciationAnalyzer.tsx - Analyze pronunciation rules
  - UnitCard.tsx / LessonCard.tsx - Learning path display
  - SearchBar.tsx - Full-text search
  - FilterPanel.tsx - Combined level + category filters
  - MainNav.tsx - **NEW** Main navigation menu
  - Updated WordList.tsx with KIIP features

- ✅ **Pages** (Final Integration)
  - Categories.tsx - Browse by category
  - Levels.tsx - Browse by KIIP level
  - Pronunciation.tsx - Learn pronunciation rules
  - Units.tsx - Browse learning paths
  - Updated Learning.tsx with search/filter
  - Updated App.tsx with new routes
  - **NEW** All pages now include MainNav for easy navigation

### Documentation (Complete)

- ✅ IMPLEMENTATION_GUIDE.md - Comprehensive implementation documentation
- ✅ DEPLOYMENT_GUIDE.md - This file
- ✅ README.md - Original project documentation
- ✅ CLAUDE.md - Development guidelines

## Deployment Steps

### 1. Prerequisites

Ensure you have:
- MongoDB installed and running on `localhost:27017`
- Node.js >= 18
- npm or yarn package manager

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urimalzen
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
EOF

# Seed the database with all initial data
npm run seed:all
# This runs 4 seed scripts in order:
# 1. seed:categories - Creates 14 major categories
# 2. seed:phoneme-rules - Creates 5 pronunciation rules
# 3. migrate:flowers - Updates existing 9 flower words
# 4. seed:kiip-words - Adds 26 KIIP sample words

# Start development server
npm run dev
```

Backend will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Create Test User

Using a tool like Postman or curl:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "level": { "cefr": "A1", "kiip": 1 },
    "country": "Mongolia",
    "region": "Ulaanbaatar"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Testing the Application

### User Journey Test

1. **Login/Registration**
   - Navigate to `http://localhost:5173`
   - Register a new account or login
   - Should redirect to `/learning`

2. **Main Navigation**
   - All pages now have a main navigation bar below the header
   - Click through: 학습하기, 카테고리, KIIP 레벨, 발음, 학습 경로
   - Verify active state highlighting works

3. **Learning Page** (`/learning`)
   - Use SearchBar to search for words (e.g., "꽃", "flower")
   - Use FilterPanel to filter by KIIP level (0-5)
   - Use FilterPanel to filter by category
   - Verify WordList updates with filtered results
   - Click on a word to view details in LearningArea
   - Use Navigation buttons (이전 학습, 처음 화면, 다음 학습)

4. **Categories Page** (`/categories`)
   - View all 14 major categories in CategoryGrid
   - Click on a category
   - Should navigate to `/learning` with category filter applied

5. **Levels Page** (`/levels`)
   - View KIIP levels 0-5 with CEFR mappings
   - Click on a level
   - Should navigate to `/learning` with level filter applied

6. **Pronunciation Page** (`/pronunciation`)
   - Enter a Korean word in PronunciationAnalyzer (e.g., "같이")
   - Click "분석" button or press Enter
   - View applicable pronunciation rules
   - Scroll down to see 5 main rule categories with examples

7. **Units Page** (`/units`)
   - View learning path units (will be empty until admin adds content)
   - Test level filtering if units exist

### API Endpoint Testing

Test key endpoints:

```bash
# Get all categories
curl http://localhost:5000/api/categories

# Get words by KIIP level 1
curl http://localhost:5000/api/words/level/1

# Search words
curl "http://localhost:5000/api/words/search/text?q=꽃"

# Get all phoneme rules
curl http://localhost:5000/api/pronunciation/rules

# Analyze pronunciation
curl -X POST http://localhost:5000/api/pronunciation/analyze \
  -H "Content-Type: application/json" \
  -d '{"word":"같이"}'

# Get words by category
curl "http://localhost:5000/api/words/category?category=자연과 환경"

# Get all units
curl http://localhost:5000/api/units
```

### Database Verification

```bash
# Connect to MongoDB
mongosh urimalzen

# Check collections
show collections

# Verify data
db.categories.countDocuments()  // Should be 14
db.phonomerules.countDocuments()  // Should be 5
db.words.countDocuments()  // Should be 35 (9 flowers + 26 KIIP words)

# Sample category
db.categories.findOne()

# Sample phoneme rule
db.phonomerules.findOne()

# Sample KIIP word
db.words.findOne({"level.kiip": {$exists: true}})
```

## Features Overview

### 1. KIIP Level System
- 6 levels: 0 (입문), 1-2 (초급), 3-4 (중급), 5 (고급)
- Mapped to CEFR: Pre-A1, A1, A2, B1, B2, C1-C2
- Difficulty scores: 1-100
- Color-coded badges in UI

### 2. 14 Major Categories
1. 인간 (Human)
2. 식생활 (Food & Diet)
3. 의생활 (Clothing)
4. 주생활 (Housing)
5. 건강과 안전 (Health & Safety)
6. 교육 (Education)
7. 직업과 일 (Occupation & Work)
8. 여가와 취미 (Leisure & Hobbies)
9. 경제 생활 (Economic Life)
10. 교통과 통신 (Transportation & Communication)
11. 장소와 지역 (Places & Regions)
12. 자연과 환경 (Nature & Environment)
13. 사회와 문화 (Society & Culture)
14. 인간관계와 소통 (Relationships & Communication)

### 3. 5 Pronunciation Rules
1. 연음 (Liaison) - Consonant carries to next syllable
2. 비음화 (Nasalization) - Consonants become nasal sounds
3. 유음화 (Liquidization) - ㄴ becomes ㄹ
4. 구개음화 (Palatalization) - ㄷ, ㅌ become ㅈ, ㅊ
5. 경음화 (Tensification) - Plain consonants become tense

### 4. Learning Features
- Full-text search across Korean and Mongolian
- Multi-level filtering (KIIP level + category)
- Pronunciation analysis with rule explanations
- Unit/Lesson learning paths (admin can populate)
- Progress tracking per word
- Ranking system (global/country/region)
- Audio recording and playback

### 5. Admin Features
- User management
- Word CRUD operations with KIIP fields
- Category management
- Unit/Lesson management
- Recording moderation

## Navigation Structure

```
우리말젠 App
│
├── Header (User info, progress, score, ranking, logout)
├── MainNav (Main navigation menu - NEW)
│   ├── 학습하기 (/learning)
│   ├── 카테고리 (/categories)
│   ├── KIIP 레벨 (/levels)
│   ├── 발음 (/pronunciation)
│   └── 학습 경로 (/units)
│
└── Page Content
    ├── /learning - Main learning interface
    │   ├── SearchBar + FilterPanel (left)
    │   ├── LearningArea + Navigation (center)
    │   └── SelfStudy + RankingInfo (right)
    │
    ├── /categories - Browse by category
    │   └── CategoryGrid (14 categories)
    │
    ├── /levels - Browse by KIIP level
    │   └── LevelSelector (6 levels)
    │
    ├── /pronunciation - Learn pronunciation
    │   ├── PronunciationAnalyzer
    │   └── 5 rule categories with examples
    │
    └── /units - Learning paths
        └── Unit cards with lessons
```

## Production Deployment

### Backend (PM2)

```bash
cd backend

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/index.js --name urimalzen-backend

# Setup startup script
pm2 startup
pm2 save
```

### Frontend (Nginx)

```bash
cd frontend

# Update .env with production API URL
echo "VITE_API_URL=https://api.urimalzen.com/api" > .env

# Build
npm run build

# Copy to Nginx
sudo cp -r dist/* /var/www/urimalzen/
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name urimalzen.com www.urimalzen.com;

    # Frontend
    root /var/www/urimalzen;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static uploads
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection
mongosh --eval "db.adminCommand('ping')"
```

### Backend Won't Start
```bash
# Check port availability
lsof -i :5000

# Check environment variables
cat backend/.env

# Check logs
npm run dev  # View console output
```

### Frontend Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run build  # Will show TypeScript errors
```

### API Not Responding
```bash
# Test backend directly
curl http://localhost:5000/health

# Check CORS settings
# backend/src/index.ts should allow frontend origin
```

## Next Steps

1. **Populate Content**
   - Admin adds more KIIP words (currently 26 samples)
   - Admin creates Units and Lessons for learning paths
   - Admin adds images and audio for existing words

2. **Enhance Features**
   - Implement spaced repetition algorithm
   - Add quiz/test functionality
   - Enhance pronunciation analysis with phonological engine
   - Add TTS (Text-to-Speech) integration
   - Add pronunciation scoring AI

3. **UI/UX Improvements**
   - Mobile responsive design
   - Dark mode
   - Animations and transitions
   - Loading skeletons
   - Toast notifications

4. **Performance**
   - Implement pagination for word lists
   - Add infinite scroll
   - Implement caching strategies
   - Optimize bundle size

5. **Testing**
   - Write unit tests (Jest/Vitest)
   - Write integration tests
   - Add E2E tests (Playwright/Cypress)
   - Performance testing

## Support

For issues or questions:
- Check IMPLEMENTATION_GUIDE.md for detailed technical documentation
- Review backend logs: `npm run dev` in backend directory
- Review frontend console: Browser DevTools
- Check MongoDB logs: `sudo journalctl -u mongod`

---

**Status**: ✅ All features implemented and ready for testing
**Last Updated**: 2025-11-19
