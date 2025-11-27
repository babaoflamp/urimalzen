# 우리말젠 (Urimalzen) - KIIP Implementation Guide

## 🎉 완료된 기능 (Completed Features)

이 프로젝트는 기존의 9개 꽃 단어 학습 앱에서 **완전한 KIIP (한국 사회통합프로그램) 학습 플랫폼**으로 확장되었습니다.

---

## 📋 구현된 기능 개요

### 1. KIIP 레벨 시스템 (6단계)
- **Level 0 (입문)**: Pre-A1 - 한글 자모 및 기초
- **Level 1 (초급1)**: A1 - 일상적인 기초 표현
- **Level 2 (초급2)**: A2 - 친숙한 일상 주제
- **Level 3 (중급1)**: B1 - 일상생활 및 업무
- **Level 4 (중급2)**: B2 - 복잡한 주제 이해
- **Level 5 (고급)**: C1-C2 - 전문적이고 추상적인 주제

### 2. 14가지 주제 카테고리
1. 인간 (👤 Human)
2. 식생활 (🍚 Food)
3. 의생활 (👕 Clothing)
4. 주생활 (🏠 Housing)
5. 건강과 안전 (⚕️ Health & Safety)
6. 교육 (📚 Education)
7. 직업과 일 (💼 Work)
8. 여가와 취미 (🎮 Leisure)
9. 경제 생활 (💰 Economy)
10. 교통과 통신 (🚗 Transport)
11. 장소와 지역 (📍 Places)
12. 자연과 환경 (🌳 Nature)
13. 사회와 문화 (🎭 Culture)
14. 인간관계와 소통 (🤝 Relationships)

### 3. 발음 규칙 시스템 (5가지)
- **연음 (Liaison)**: 받침이 뒤의 모음으로 이어지는 현상
- **비음화 (Nasalization)**: 비음 소리로 변하는 현상
- **유음화 (Liquidization)**: ㄴ이 ㄹ로 바뀌는 현상
- **구개음화 (Palatalization)**: ㄷ, ㅌ이 ㅈ, ㅊ으로 바뀌는 현상
- **경음화 (Tensification)**: 된소리로 발음되는 현상

### 4. 학습 경로 시스템
- **유닛 (Units)**: 주제별 학습 단위
- **레슨 (Lessons)**: 유닛 내 세부 학습
- **도전 과제 (Challenges)**: 유닛 완료 후 테스트

---

## 🏗️ 아키텍처

### Backend (Express + TypeScript + MongoDB)

#### 데이터 모델
```
backend/src/models/
├── Word.ts          # 단어 (KIIP 필드 확장)
├── Category.ts      # 카테고리 (14개)
├── PhonemeRule.ts   # 발음 규칙 (5개)
├── Unit.ts          # 학습 유닛
├── User.ts          # 사용자
├── UserProgress.ts  # 학습 진행도
└── Ranking.ts       # 랭킹
```

#### API 엔드포인트
```
/api/words          # 단어 관리 + 필터링
/api/categories     # 카테고리 관리
/api/pronunciation  # 발음 분석
/api/units          # 학습 경로
/api/auth           # 인증
/api/progress       # 진행도
/api/rankings       # 랭킹
/api/admin          # 관리자
```

#### Seed Scripts
```bash
npm run seed:categories      # 14개 카테고리
npm run seed:phoneme-rules   # 5개 발음 규칙
npm run migrate:flowers      # 기존 꽃 단어 마이그레이션
npm run seed:kiip-words      # 26개 KIIP 샘플 단어
npm run seed:all             # 위 4개 모두 실행
```

### Frontend (React + Vite + TypeScript + Zustand)

#### 페이지 구조
```
frontend/src/pages/
├── Learning.tsx       # 메인 학습 페이지 (필터 + 검색 추가)
├── Categories.tsx     # 카테고리 탐색
├── Levels.tsx         # KIIP 레벨 선택
├── Pronunciation.tsx  # 발음 학습
├── Units.tsx          # 학습 경로
├── Login.tsx          # 로그인
├── AdminLogin.tsx     # 관리자 로그인
└── AdminDashboard.tsx # 관리자 대시보드
```

#### 컴포넌트 구조
```
frontend/src/components/
├── CategoryGrid.tsx        # 카테고리 그리드 (NEW)
├── LevelSelector.tsx       # 레벨 선택기 (NEW)
├── PronunciationAnalyzer.tsx  # 발음 분석기 (NEW)
├── UnitCard.tsx            # 유닛/레슨 카드 (NEW)
├── SearchBar.tsx           # 검색 바 (NEW)
├── FilterPanel.tsx         # 필터 패널 (NEW)
├── WordList.tsx            # 단어 목록 (UPDATED)
├── Header.tsx              # 헤더
├── LearningArea.tsx        # 학습 영역
├── Navigation.tsx          # 네비게이션
├── RecordingControls.tsx   # 녹음 컨트롤
├── RankingInfo.tsx         # 랭킹 정보
└── SelfStudy.tsx           # 자율 학습
```

#### 상태 관리 (Zustand Stores)
```
frontend/src/store/
├── useAuthStore.ts          # 인증 상태
├── useLearningStore.ts      # 학습 상태 (EXTENDED)
├── useCategoryStore.ts      # 카테고리 상태 (NEW)
├── usePronunciationStore.ts # 발음 상태 (NEW)
└── useUnitStore.ts          # 유닛 상태 (NEW)
```

---

## 🚀 시작하기

### 1. 프로젝트 클론 및 설치

```bash
# 프로젝트 디렉토리로 이동
cd /home/scottk/Projects/urimalzen

# Backend 설치
cd backend
npm install

# Frontend 설치
cd ../frontend
npm install
```

### 2. 환경 변수 설정

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
```

### 3. MongoDB 시작

```bash
# MongoDB가 실행 중인지 확인
sudo systemctl status mongod

# 실행 중이 아니면 시작
sudo systemctl start mongod
```

### 4. 데이터베이스 시드

```bash
cd backend

# 모든 데이터 시드 (권장)
npm run seed:all

# 또는 개별 실행:
npm run seed:categories      # 14개 카테고리
npm run seed:phoneme-rules   # 5개 발음 규칙
npm run migrate:flowers      # 기존 9개 꽃 단어 마이그레이션
npm run seed:kiip-words      # 26개 KIIP 샘플 단어
```

### 5. 서버 시작

**Backend** (터미널 1):
```bash
cd backend
npm run dev
# Server: http://localhost:5000
```

**Frontend** (터미널 2):
```bash
cd frontend
npm run dev
# Server: http://localhost:5173
```

### 6. 접속

브라우저에서 `http://localhost:5173` 접속

---

## 📱 사용 가이드

### 사용자 기능

#### 1. 로그인/회원가입
- `/login` - 로그인 또는 회원가입
- 이메일, 사용자명, 비밀번호, 지역, 국가 정보 입력

#### 2. 메인 학습 페이지 (`/learning`)
**좌측 패널**:
- **검색 바**: 한국어/몽골어 검색
- **필터 패널**: KIIP 레벨 (0-5), 카테고리 선택
- **단어 목록**: 필터링된 단어 목록

**중앙 영역**:
- **학습 영역**: 현재 단어 학습
- **네비게이션**: 이전/다음 단어

**우측 패널**:
- **자율 학습**: 자유 학습 모드
- **랭킹 정보**: 글로벌/국가/지역 랭킹

#### 3. 카테고리 탐색 (`/categories`)
- 14개 주제 카테고리 그리드로 표시
- 카테고리 선택 → 해당 카테고리 단어로 필터링
- "학습 시작하기" 버튼으로 학습 페이지 이동

#### 4. 레벨 선택 (`/levels`)
- KIIP 0-5 단계 설명 및 선택
- 각 레벨의 CEFR 매핑 및 학습 목표 표시
- 레벨 선택 → 해당 레벨 단어로 필터링

#### 5. 발음 학습 (`/pronunciation`)
- **발음 분석기**: 한국어 단어 입력 → 적용되는 발음 규칙 분석
- **5가지 발음 규칙 설명**: 연음, 비음화, 유음화, 구개음화, 경음화
- **예시 단어**: 각 규칙별 예시 제공

#### 6. 학습 경로 (`/units`)
- 유닛 목록 표시 (향후 관리자가 추가)
- KIIP 레벨별 필터링
- 각 유닛의 레슨 수 및 도전 과제 확인

### 관리자 기능

#### 1. 관리자 로그인 (`/admin/login`)
- 관리자 계정으로 로그인

#### 2. 관리자 대시보드 (`/admin/dashboard`)
- 사용자 관리
- 단어 관리 (CRUD)
- 녹음 관리
- 통계 확인

---

## 🎨 디자인 시스템

### Glassmorphism 테마
- 반투명 배경: `rgba(255, 255, 255, 0.15-0.2)`
- 블러 효과: `backdrop-filter: blur(10-20px)`
- 부드러운 테두리 및 그림자
- 매끄러운 전환 효과

### 색상 코딩 (KIIP 레벨)
| 레벨 | 색상 | Hex Code |
|------|------|----------|
| 0 (입문) | Gray | `#94a3b8` |
| 1 (초급1) | Blue | `#60a5fa` |
| 2 (초급2) | Green | `#34d399` |
| 3 (중급1) | Yellow | `#fbbf24` |
| 4 (중급2) | Orange | `#fb923c` |
| 5 (고급) | Red | `#f87171` |

---

## 📊 데이터 구조

### Word 모델
```typescript
{
  koreanWord: string;           // 한국어 단어
  mongolianWord: string;        // 몽골어 번역
  pronunciation: string;        // 발음
  level: {
    kiip: 0 | 1 | 2 | 3 | 4 | 5;  // KIIP 레벨
    cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';  // CEFR 레벨
  };
  mainCategory: string;         // 주 카테고리
  subCategory: string;          // 하위 카테고리
  phonemeRules: string[];       // 적용되는 발음 규칙
  difficultyScore: number;      // 난이도 점수 (1-100)
  wordType: string;             // 품사
  formalityLevel: string;       // 격식 수준
  // ... 기타 필드
}
```

### Category 모델
```typescript
{
  name: string;           // 카테고리 이름 (한국어)
  nameEn: string;         // 영어 이름
  nameMn: string;         // 몽골어 이름
  order: number;          // 순서 (1-14)
  icon: string;           // 아이콘 emoji
  description: string;    // 설명 (한국어)
  descriptionMn: string;  // 설명 (몽골어)
  subCategories: string[]; // 하위 카테고리 목록
  color: string;          // 색상 코드
}
```

### PhonemeRule 모델
```typescript
{
  ruleName: string;       // 규칙 이름 (한국어)
  ruleNameEn: string;     // 영어 이름
  ruleNameMn: string;     // 몽골어 이름
  description: string;    // 설명 (한국어)
  descriptionMn: string;  // 설명 (몽골어)
  pattern: string;        // 정규식 패턴
  examples: [{
    word: string;         // 예시 단어
    written: string;      // 표기
    pronounced: string;   // 발음
    writtenMn: string;    // 몽골어 표기
    pronouncedMn: string; // 몽골어 발음
  }];
  kiipLevel: number;      // 해당 KIIP 레벨
  order: number;          // 순서 (1-5)
}
```

---

## 🔧 개발 가이드

### 새 카테고리 추가
1. `seedCategories.ts` 수정
2. `npm run seed:categories` 실행

### 새 발음 규칙 추가
1. `seedPhonemeRules.ts` 수정
2. `npm run seed:phoneme-rules` 실행

### 새 단어 추가 (관리자)
- 관리자 대시보드에서 직접 추가
- 또는 시드 스크립트 작성

### 새 유닛/레슨 추가 (관리자)
- API 엔드포인트 사용:
  - `POST /api/units` - 유닛 생성
  - `POST /api/units/:id/lessons` - 레슨 추가

---

## 📈 API 엔드포인트 목록

### Words API
```
GET    /api/words                    # 모든 단어
GET    /api/words/:id                # ID로 단어 조회
GET    /api/words/order/:order       # 순서로 단어 조회
GET    /api/words/level/:kiipLevel   # 레벨별 단어 (NEW)
GET    /api/words/category/:category # 카테고리별 단어 (NEW)
GET    /api/words/search             # 다중 조건 검색 (NEW)
GET    /api/words/search/text?q=...  # 텍스트 검색 (NEW)
POST   /api/words                    # 단어 생성 (인증 필요)
```

### Categories API
```
GET    /api/categories               # 모든 카테고리
GET    /api/categories/:id           # ID로 조회
GET    /api/categories/name/:name    # 이름으로 조회
GET    /api/categories/:id/words     # 카테고리의 단어들
GET    /api/categories/:id/stats     # 카테고리 통계
POST   /api/categories               # 카테고리 생성 (관리자)
PUT    /api/categories/:id           # 카테고리 수정 (관리자)
DELETE /api/categories/:id           # 카테고리 삭제 (관리자)
```

### Pronunciation API
```
GET    /api/pronunciation/rules      # 모든 발음 규칙
GET    /api/pronunciation/rules/:id  # ID로 규칙 조회
GET    /api/pronunciation/rules/name/:ruleName  # 이름으로 조회
POST   /api/pronunciation/analyze    # 단어 발음 분석
POST   /api/pronunciation/rules      # 규칙 생성 (관리자)
PUT    /api/pronunciation/rules/:id  # 규칙 수정 (관리자)
DELETE /api/pronunciation/rules/:id  # 규칙 삭제 (관리자)
```

### Units API
```
GET    /api/units                    # 모든 유닛
GET    /api/units/:id                # ID로 조회
GET    /api/units/number/:unitNumber # 번호로 조회
GET    /api/units/level/:kiipLevel   # 레벨별 유닛
GET    /api/units/category/:category # 카테고리별 유닛
GET    /api/units/:id/lessons        # 유닛의 레슨들
GET    /api/units/:unitId/lessons/:lessonNumber  # 특정 레슨
POST   /api/units                    # 유닛 생성 (관리자)
PUT    /api/units/:id                # 유닛 수정 (관리자)
DELETE /api/units/:id                # 유닛 삭제 (관리자)
POST   /api/units/:id/lessons        # 레슨 추가 (관리자)
```

---

## 🐛 문제 해결

### MongoDB 연결 실패
```bash
# MongoDB 상태 확인
sudo systemctl status mongod

# MongoDB 시작
sudo systemctl start mongod

# MongoDB 재시작
sudo systemctl restart mongod
```

### 포트 충돌
- Backend: `PORT=5000` (`.env`에서 변경 가능)
- Frontend: Vite 기본 포트 `5173`

### CORS 에러
- Backend `index.ts`에서 CORS 설정 확인
- 현재 모든 origin 허용 (`origin: '*'`)

---

## 🎯 향후 개선 사항

### 기능 추가
- [ ] 유닛/레슨 콘텐츠 확장 (현재 구조만 구현)
- [ ] 단어 TTS (Text-to-Speech) 통합
- [ ] 발음 평가 AI 통합
- [ ] 스페이스 리피티션 알고리즘
- [ ] 퀴즈 및 테스트 기능
- [ ] 학습 분석 대시보드

### UI/UX 개선
- [ ] 반응형 디자인 (모바일 최적화)
- [ ] 다크 모드
- [ ] 애니메이션 개선
- [ ] 로딩 스켈레톤

### 성능 최적화
- [ ] 이미지 lazy loading
- [ ] 무한 스크롤
- [ ] API 응답 캐싱
- [ ] 번들 크기 최적화

---

## 📝 라이센스


**마지막 업데이트**: 2025-11-19
**버전**: 2.0.0 (KIIP 전체 구현)
