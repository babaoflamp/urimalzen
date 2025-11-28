# AI 한국어 학습 플랫폼 - 미디어젠

**대한민국 이주민을 위한 포괄적 한국어 학습 솔루션**

KIIP(Korea Immigration & Integration Program) 프레임워크 기반으로 체계적인 한국어 교육을 제공하는 웹 기반 언어 학습 플랫폼입니다. 다양한 국가 출신 이주민들의 한국 사회 통합을 지원합니다.

---

## 📢 서비스 업데이트 공지 (2025-11-28)

### ✨ 주요 변경사항

**1. 포트 번호 없이 접속 가능**
- 기존: `http://192.168.200.200:5173`
- 변경: `https://192.168.200.200` (포트 생략)

**2. HTTPS 보안 연결 적용**
- 모든 통신이 SSL/TLS로 암호화됩니다
- HTTP 접속 시 자동으로 HTTPS로 리다이렉트됩니다
- 브라우저 보안 경고는 자체 서명 인증서 사용으로 인한 정상 동작입니다

**3. 시스템 개선**
- Nginx 리버스 프록시 구성으로 성능 향상
- 정적 파일 캐싱 및 gzip 압축 활성화
- 보안 헤더 추가 (HSTS, X-Frame-Options 등)
- 프론트엔드 TypeScript 컴파일 에러 수정
- 중국어(Chinese) 지원 추가 (Word 타입)

### 📝 접속 방법
```
https://192.168.200.200
```

### ⚠️ 참고사항
- 첫 접속 시 브라우저에서 "안전하지 않음" 경고가 표시될 수 있습니다
- Chrome/Edge: "고급" → "192.168.200.200(으)로 이동(안전하지 않음)" 클릭
- Firefox: "고급" → "위험을 감수하고 계속" 클릭
- 이는 자체 서명 인증서 사용으로 인한 정상적인 절차입니다

---

## 지원 대상 국가

현재 몽골어를 기준으로 개발되었으며, 향후 다음 언어를 지원할 예정입니다:

- 🇨🇳 **중국어** (Chinese) - 현재 지원
- 🇲🇳 **몽골어** (Mongolian) - 현재 지원
- 🇻🇳 **베트남어** (Vietnamese) - 개발 예정
- 🇮🇩 **인도네시아어** (Indonesian) - 개발 예정
- 🇯🇵 **일본어** (Japanese) - 개발 예정
- 🇵🇭 **필리핀어** (Filipino/Tagalog) - 개발 예정
- 기타 이주민 언어 확장 가능

## 프로젝트 구조

```
urimalzen/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express + TypeScript + MongoDB
└── requirements/      # 요구사항 문서
```

## 플랫폼 특징

### KIIP 프레임워크 통합
- 법무부 사회통합프로그램(KIIP) 커리큘럼 기반
- 6단계 레벨 시스템 (0-5급)
- 14개 주제별 카테고리 분류
- 표준화된 교육 과정 제공

### 다국어 지원 아키텍처
- 확장 가능한 언어 모듈 구조
- 언어별 번역 데이터 관리
- 모국어 기반 학습 지원
- 다국어 UI/UX 최적화

## 주요 기능

### KIIP 커리큘럼 기반 학습
- ✅ **레벨별 학습 경로**: KIIP 0-5급 체계적 진행
- ✅ **14개 주제 카테고리**: 인사, 자기소개, 음식, 쇼핑, 교통, 일상생활, 가족, 날씨, 취미, 건강, 주거, 직업, 한국문화, 자연
- ✅ **Unit/Lesson 구조**: 단계별 커리큘럼 제공
- ✅ **체계적 어휘 학습**: 예문, 유의어, 반의어, 연어 포함

### 발음 및 음성 학습
- ✅ **한국어 발음 규칙**: 음운 변동 규칙 학습
- ✅ **음성 녹음 기능**: 자신의 발음 녹음 및 저장
- ✅ **발음 분석**: 표준 발음과 비교 (MediaRecorder API)

### 진도 관리 및 평가
- ✅ **개인별 학습 진도 추적**: 단어별 완료도 및 점수
- ✅ **다중 레벨 순위 시스템**: 세계/국가/지역별 랭킹
- ✅ **CEFR 연계**: A1-C2 국제 표준 레벨 매핑
- ✅ **난이도 및 빈도 기반 학습**: 체계적 단어 선택
- ✅ **Unit별 도전 과제**: 레벨별 평가 시스템

### 다국어 지원 (확장 가능)
- ✅ **모국어 번역 제공**: 한국어-모국어 쌍 데이터
- ✅ **언어별 데이터 모델**: 확장 가능한 구조
- ✅ **사용자 국가/지역 관리**: 맞춤형 콘텐츠 제공

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

### KIIP 레벨 시스템 (법무부 표준)
- **레벨 0 (초급)**: 한글 및 기초 의사소통
- **레벨 1-2 (초급-중급)**: 일상생활 기본 회화
- **레벨 3-4 (중급-중고급)**: 사회생활 및 직업 활동
- **레벨 5 (고급)**: 전문 분야 및 고급 한국어

### 14개 KIIP 주제 카테고리
1. **인사** (Greetings) - 기본 인사 및 예절
2. **자기소개** (Self-introduction) - 신상정보, 배경
3. **음식** (Food) - 식사, 요리, 식문화
4. **쇼핑** (Shopping) - 물건 구매, 가격 협상
5. **교통** (Transportation) - 대중교통, 길 찾기
6. **일상생활** (Daily Life) - 생활 루틴, 습관
7. **가족** (Family) - 가족 구성, 관계
8. **날씨와 계절** (Weather & Seasons) - 기후, 계절 활동
9. **취미와 여가** (Hobbies & Leisure) - 여가 활동, 관심사
10. **건강** (Health) - 병원, 건강 관리
11. **주거** (Housing) - 집, 주거 환경
12. **직업과 일** (Work & Career) - 직장 생활, 업무
13. **한국문화** (Korean Culture) - 전통, 관습, 역사
14. **자연과 환경** (Nature & Environment) - 자연, 환경 보호

### 다국어 데이터 모델

**현재 지원**: 한국어 ↔ 몽골어

**확장 예정**:
- 한국어 ↔ 베트남어
- 한국어 ↔ 인도네시아어
- 한국어 ↔ 일본어
- 한국어 ↔ 중국어
- 한국어 ↔ 필리핀어

### 초기 데이터 (몽골어 버전)

기본 학습 단어 예시 (꽃 이름 - 자연과 환경 카테고리):

1. 민들레 - Цэцэрлэг (Dandelion)
2. 환주리 - Хуануури
3. 들국화 - Хээрийн хризантем (Wild Chrysanthemum)
4. 은방울 - Мөнгөн хонх (Lily of the Valley)
5. 개나리 - Форзици (Forsythia)
6. 진달래 - Азалиа (Azalea)
7. 패랭이 - Гвоздик (Pink/Dianthus)
8. 제비꽃 - Нил цэцэг (Violet)
9. 해바라기 - Наранцэцэг (Sunflower)

**데이터 로드**: `npm run seed:all` (카테고리, 발음 규칙, KIIP 단어 등)

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

## 프로젝트 비전

### 목표
대한민국에 거주하는 다양한 국가 출신 이주민들이 효과적으로 한국어를 학습하고, 한국 사회에 성공적으로 통합될 수 있도록 지원하는 포괄적 언어 교육 플랫폼을 제공합니다.

### 핵심 가치
- **접근성**: 모국어 기반 학습으로 언어 장벽 최소화
- **표준화**: KIIP 공식 커리큘럼 준수
- **확장성**: 다양한 언어로 쉽게 확장 가능한 아키텍처
- **실용성**: 실생활 중심의 실용적 한국어 교육
- **사회통합**: 한국 문화 이해 및 사회 적응 지원

### 로드맵
1. **Phase 1** (현재): 몽골어 버전 완성
2. **Phase 2**: 베트남어, 인도네시아어 추가
3. **Phase 3**: 중국어, 필리핀어, 일본어 추가
4. **Phase 4**: AI 기반 발음 평가 및 맞춤형 학습 경로
5. **Phase 5**: 모바일 앱 개발 및 오프라인 학습 지원

## 개발 정보

### 개발 팀
- **매니저**: 김영훈 (scottk) - yh.kim@mediazen.co.kr
- **소속**: 신사업TF팀
- **기술 스택**:
  - Backend: Express 5 + TypeScript + MongoDB
  - Frontend: React 19 + TypeScript + Vite
  - 다국어 지원: i18n 기반 확장 가능 구조

### 기여 및 확장
본 프로젝트는 다양한 언어 추가를 환영합니다. 새로운 언어 추가 시 다음 데이터를 제공해주세요:
- 한국어-목표언어 단어 번역
- 예문 번역
- UI/UX 번역

## 라이선스

MIT License

**For Immigration Integration & Korean Language Education**
