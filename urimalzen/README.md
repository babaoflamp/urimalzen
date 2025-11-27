# 우리말젠 - 한국어-몽골어 학습 애플리케이션

한국어를 배우는 몽골인들을 위한 웹 기반 언어 학습 플랫폼입니다.

## 프로젝트 구조

```
urimalzen/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express + TypeScript + MongoDB
└── requirements/      # 요구사항 문서
```

## 주요 기능

- ✅ 사용자 인증 (회원가입/로그인)
- ✅ 9개 꽃 이름 단어 학습
- ✅ 음성 녹음 및 저장 (MediaRecorder API)
- ✅ 학습 진도 추적
- ✅ 세계/국가/지역 순위 시스템
- ✅ CEFR/KIIP 레벨 관리
- ✅ 예문, 유의어, 영상 자료 제공

## 기술 스택

### 프론트엔드
- React 18
- TypeScript
- Vite
- Zustand (상태 관리)
- React Router
- Axios

### 백엔드
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT 인증
- Multer (파일 업로드)

## 설치 및 실행

### 1. MongoDB 설치 및 실행

```bash
# Ubuntu/Linux
sudo apt-get install mongodb
sudo systemctl start mongodb

# 또는 Docker 사용
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. 백엔드 설정 및 실행

```bash
cd backend

# 환경 변수 설정
# .env 파일이 이미 생성되어 있습니다
# 필요시 JWT_SECRET 변경

# 의존성 설치 (이미 완료됨)
npm install

# 초기 단어 데이터 시딩
npm run seed

# 개발 모드 실행
npm run dev

# 또는 프로덕션 빌드 후 실행
npm run build
npm start
```

백엔드 서버는 `http://localhost:5000`에서 실행됩니다.

### 3. 프론트엔드 설정 및 실행

```bash
cd frontend

# 환경 변수 확인
# .env 파일에서 API URL 확인

# 의존성 설치 (이미 완료됨)
npm install

# 개발 모드 실행
npm run dev

# 또는 프로덕션 빌드
npm run build
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회

### 단어
- `GET /api/words` - 모든 단어 조회
- `GET /api/words/:id` - 단어 상세 조회
- `GET /api/words/order/:order` - 순서로 단어 조회

### 녹음
- `POST /api/recordings` - 녹음 업로드
- `GET /api/recordings` - 내 녹음 목록
- `GET /api/recordings/word/:wordId` - 특정 단어 녹음 조회

### 진도
- `GET /api/progress` - 학습 진도 조회
- `POST /api/progress` - 진도 업데이트

### 순위
- `GET /api/rankings/me` - 내 순위 조회
- `GET /api/rankings/global` - 전체 순위
- `GET /api/rankings/country/:country` - 국가별 순위
- `GET /api/rankings/region/:region` - 지역별 순위

## 초기 데이터

시스템에는 9개의 꽃 이름 단어가 포함되어 있습니다:

1. 만들레 (민들레) - Цэцэрлэг
2. 환주리 - Хуануури
3. 들국화 - Хээрийн хризантем
4. 은방울 - Мөнгөн хонх
5. 개나리 - Форзици
6. 진달래 - Азалиа
7. 패랭이 - Гвоздик
8. 제비꽃 - Нил цэцэг
9. 해바라기 - Наранцэцэг

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
