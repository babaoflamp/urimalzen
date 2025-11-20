# 우리말젠 - 한국어-몽골어 학습 애플리케이션

한국어를 배우는 몽골인들을 위한 웹 기반 언어 학습 플랫폼입니다. KIIP(Korea Immigration & Integration Program) 통합으로 체계적인 한국어 학습을 지원합니다.

## 프로젝트 구조

```
urimalzen/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express + TypeScript + MongoDB
└── requirements/      # 요구사항 문서
```

## 주요 기능

### 학습 기능
- ✅ 사용자 인증 (회원가입/로그인)
- ✅ KIIP 6단계 레벨 시스템 (0-5급)
- ✅ 14개 주요 카테고리 분류 (인사, 자기소개, 음식, 쇼핑, 교통 등)
- ✅ Unit/Lesson 기반 커리큘럼
- ✅ 9개 꽃 이름 단어 학습 (기초)
- ✅ 음성 녹음 및 저장 (MediaRecorder API)
- ✅ 한국어 발음 규칙 분석
- ✅ 예문, 유의어, 반의어, 연어 제공

### 진도 및 평가
- ✅ 학습 진도 추적
- ✅ 세계/국가/지역 순위 시스템
- ✅ CEFR/KIIP 레벨 관리 (A1-C2)
- ✅ 난이도 점수 및 빈도 순위
- ✅ Unit별 도전 과제

## 기술 스택

### 프론트엔드
- React 19
- TypeScript 5.9
- Vite 7
- Zustand 5 (상태 관리)
- React Router 7
- Axios

### 백엔드
- Node.js
- Express 5
- TypeScript 5.9
- MongoDB + Mongoose 8
- JWT 인증
- Multer 2 (파일 업로드)

## 설치 및 실행

### 1. MongoDB 설치 및 실행

```bash
# Docker 사용 (권장)
docker run -d -p 27017:27017 --name urimalzen-mongodb mongo:latest

# 또는 Docker Compose (프로젝트에서 사용 중)
# MongoDB는 이미 urimalzen-mongodb 컨테이너로 실행 중

# MongoDB 상태 확인
docker ps --filter "name=mongo"
```

### 2. 백엔드 설정 및 실행

```bash
cd backend

# 환경 변수 설정
# .env 파일이 이미 생성되어 있습니다
# 필요시 JWT_SECRET 변경

# 의존성 설치
npm install

# 데이터베이스 초기화 (순서대로 실행)
npm run seed:categories        # 14개 KIIP 카테고리
npm run seed:phoneme-rules     # 한국어 발음 규칙
npm run migrate:flowers        # 9개 꽃 단어 마이그레이션
npm run seed:kiip-words        # KIIP 단어 데이터

# 또는 모두 한번에 실행
npm run seed:all

# 개발 모드 실행
npm run dev

# 또는 프로덕션 빌드 후 실행
npm run build
npm start
```

백엔드 서버는 `http://0.0.0.0:5000`에서 실행됩니다 (외부 접근 가능).

### 3. 프론트엔드 설정 및 실행

```bash
cd frontend

# 환경 변수 확인
# .env 파일에서 API URL 확인

# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 또는 프로덕션 빌드
npm run build
```

프론트엔드는 `http://0.0.0.0:5173`에서 실행됩니다 (외부 접근 가능).

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회 (인증 필요)

### 단어 (Words)
- `GET /api/words` - 모든 단어 조회
- `GET /api/words/:id` - 단어 상세 조회
- `GET /api/words/order/:order` - 순서로 단어 조회
- `GET /api/words/level/:kiipLevel` - KIIP 레벨별 단어 조회
- `GET /api/words/category/:category` - 카테고리별 단어 조회

### 카테고리 (Categories)
- `GET /api/categories` - 모든 카테고리 조회
- `GET /api/categories/:id` - 카테고리 상세 조회
- `GET /api/categories/:id/stats` - 카테고리 통계

### 발음 (Pronunciation)
- `GET /api/pronunciation/rules` - 발음 규칙 조회
- `GET /api/pronunciation/rules/:id` - 발음 규칙 상세
- `POST /api/pronunciation/analyze` - 단어 발음 분석

### 유닛 (Units)
- `GET /api/units` - 모든 유닛 조회
- `GET /api/units/:id` - 유닛 상세 조회
- `GET /api/units/level/:kiipLevel` - KIIP 레벨별 유닛 조회
- `POST /api/units` - 유닛 생성 (관리자)
- `POST /api/units/:id/lessons` - 레슨 추가 (관리자)

### 녹음 (Recordings)
- `POST /api/recordings` - 녹음 업로드 (인증 필요)
- `GET /api/recordings` - 내 녹음 목록 (인증 필요)
- `GET /api/recordings/word/:wordId` - 특정 단어 녹음 조회

### 진도 (Progress)
- `GET /api/progress` - 학습 진도 조회 (인증 필요)
- `POST /api/progress` - 진도 업데이트 (인증 필요)

### 순위 (Rankings)
- `GET /api/rankings/me` - 내 순위 조회 (인증 필요)
- `GET /api/rankings/global` - 전체 순위
- `GET /api/rankings/country/:country` - 국가별 순위
- `GET /api/rankings/region/:region` - 지역별 순위

### 관리자 (Admin)
- `GET /api/admin/stats` - 대시보드 통계 (관리자)
- `GET /api/admin/users` - 사용자 목록 (관리자)
- `POST /api/admin/words` - 단어 추가 (관리자)
- `PUT /api/admin/words/:id` - 단어 수정 (관리자)
- `DELETE /api/admin/words/:id` - 단어 삭제 (관리자)

## 데이터 구조

### KIIP 레벨 시스템
- **레벨 0**: 초급 (입문)
- **레벨 1-2**: 초급-중급
- **레벨 3-4**: 중급-중고급
- **레벨 5**: 고급

### 14개 주요 카테고리
1. 인사 (Greetings)
2. 자기소개 (Self-introduction)
3. 음식 (Food)
4. 쇼핑 (Shopping)
5. 교통 (Transportation)
6. 일상생활 (Daily Life)
7. 가족 (Family)
8. 날씨와 계절 (Weather & Seasons)
9. 취미와 여가 (Hobbies & Leisure)
10. 건강 (Health)
11. 주거 (Housing)
12. 직업과 일 (Work & Career)
13. 한국문화 (Korean Culture)
14. 자연과 환경 (Nature & Environment)

### 초기 데이터

기본 학습 단어 (9개 꽃 이름):

1. 만들레 (민들레) - Цэцэрлэг (Dandelion)
2. 환주리 - Хуануури
3. 들국화 - Хээрийн хризантем (Wild Chrysanthemum)
4. 은방울 - Мөнгөн хонх (Lily of the Valley)
5. 개나리 - Форзици (Forsythia)
6. 진달래 - Азалиа (Azalea)
7. 패랭이 - Гвоздик (Pink/Dianthus)
8. 제비꽃 - Нил цэцэг (Violet)
9. 해바라기 - Наранцэцэг (Sunflower)

추가 데이터는 `npm run seed:all` 명령으로 로드됩니다.

## 배포 (서버)

### PM2를 사용한 백엔드 배포

```bash
# PM2 설치
npm install -g pm2

# 백엔드 빌드
cd backend
npm run build

# PM2로 실행
pm2 start dist/index.js --name urimalzen-backend

# 자동 시작 설정
pm2 startup
pm2 save
```

### Nginx 설정

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 프론트엔드
    location / {
        root /home/mediazen/projects/urimalzen/frontend/dist;
        try_files $uri /index.html;
    }

    # 백엔드 API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 업로드 파일
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

## 개발 팀

- Backend: Express + TypeScript + MongoDB
- Frontend: React + TypeScript + Vite
- Design: 한국어-몽골어 학습 UI

## 라이선스

MIT
